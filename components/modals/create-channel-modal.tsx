"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Channels } from "@/lib/db/schema";
import { useChannels } from "@/lib/hooks";
import { fetcher } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

interface CreateChannelModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function CreateChannelModal({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: CreateChannelModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"public" | "private">("public");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const workspaceId = searchParams.get("workspace");

  const { mutate } = useChannels(workspaceId || undefined);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const onOpenChange = isControlled ? setControlledOpen : setOpen;

  const handleNameChange = (value: string) => {
    // Channel names should be lowercase, no spaces, max 80 chars
    const formatted = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "")
      .slice(0, 80);
    setName(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !workspaceId) return;

    setIsSubmitting(true);
    try {
      const channel = await fetcher<Channels>(
        `/api/workspaces/${workspaceId}/channels`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, type }),
        },
        "Failed to create channel",
      );

      // Refresh channels list
      await mutate();

      // Navigate to new channel
      const params = new URLSearchParams(searchParams.toString());
      params.set("channel", channel.id);
      router.push(`?${params.toString()}`);

      onOpenChange?.(false);
      setName("");
      setDescription("");
      setType("public");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Channels are where your team communicates.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Channel Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. plan-budget"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this channel about?"
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-2">
              <div className="space-y-0.5">
                <Label htmlFor="private-channel">Private Channel</Label>
                <div className="text-sm text-muted-foreground">
                  Only invited members can view and join this channel.
                </div>
              </div>
              <Switch
                id="private-channel"
                checked={type === "private"}
                onCheckedChange={(checked) =>
                  setType(checked ? "private" : "public")
                }
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange?.(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              loadingText="Creating..."
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting || !name.trim()}
            >
              Create Channel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CreateChannelModalWrapper({
  children,
  open,
  onOpenChange,
}: CreateChannelModalProps) {
  return (
    <Suspense fallback={null}>
      <CreateChannelModal open={open} onOpenChange={onOpenChange}>
        {children}
      </CreateChannelModal>
    </Suspense>
  );
}

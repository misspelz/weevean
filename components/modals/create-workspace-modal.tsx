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
import { Workspaces } from "@/lib/db/schema";
import { useWorkspaces } from "@/lib/hooks";
import { fetcher } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateWorkspaceModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateWorkspaceModal({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: CreateWorkspaceModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { mutate } = useWorkspaces();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const onOpenChange = isControlled ? setControlledOpen : setOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const workspace = await fetcher<Workspaces>(
        "/api/workspaces",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        },
        "Failed to create workspace",
      );

      await mutate();

      router.push(`?workspace=${workspace.id}`);

      onOpenChange?.(false);
      setName("");
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
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Add a new workspace to organize your channels and members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Workspace Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Corp"
                disabled={isSubmitting}
                autoFocus
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
              loading={isSubmitting}
              type="submit"
              disabled={isSubmitting || !name.trim()}
            >
              Create Workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

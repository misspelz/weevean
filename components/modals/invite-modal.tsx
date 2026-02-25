"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkspaceInvites } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";
import { Check, Copy, Link } from "lucide-react";
import { Suspense, useState } from "react";
import { toast } from "sonner";

interface InviteModalProps {
  children?: React.ReactNode;
  workspaceId: string;
  workspaceName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function InviteModal({
  children,
  workspaceId,
  workspaceName,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: InviteModalProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const onOpenChange = (newOpen: boolean) => {
    if (isControlled && setControlledOpen) {
      setControlledOpen(newOpen);
    } else {
      setOpen(newOpen);
    }

    if (!newOpen) {
      // Reset state when closing
      setTimeout(() => {
        setInviteLink("");
        setCopied(false);
      }, 300);
    }
  };

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const invite = await fetcher<WorkspaceInvites>(
        `/api/workspaces/${workspaceId}/invites`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expiresInDays: 7 }),
        },
        "Failed to generate invite link",
      );

      const url = `${window.location.origin}/auth/invite/${invite.code}`;
      setInviteLink(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite people to {workspaceName}</DialogTitle>
          <DialogDescription>
            Share this link with others to grant them access to this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {!inviteLink ? (
            <div className="flex flex-col items-center justify-center gap-4 py-6">
              <div className="rounded-full bg-secondary/50 p-4">
                <Link className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Generate a secure link that expires in 7 days.
              </div>
              <Button
                onClick={handleGenerateLink}
                loading={isGenerating}
                loadingText="Generating..."
                className="mt-2 w-full sm:w-auto"
              >
                Generate Invite Link
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Label htmlFor="link">Invite Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="link"
                  value={inviteLink}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  size="icon"
                  variant={copied ? "default" : "secondary"}
                  onClick={handleCopy}
                  className="shrink-0 transition-all"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this link will be able to join {workspaceName}. It
                expires in 7 days.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function InviteModalWrapper(props: InviteModalProps) {
  return (
    <Suspense fallback={null}>
      <InviteModal {...props} />
    </Suspense>
  );
}

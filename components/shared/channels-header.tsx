"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
  Bell,
  BellOff,
  Hash,
  Lock,
  MoreVertical,
  Pin,
  Search,
  Settings,
  Users,
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  memberCount?: number;
}

interface ChatHeaderProps {
  channel: Channel;
  onViewMembers?: () => void;
  onOpenSettings?: () => void;
  onToggleNotifications?: () => void;
  notificationsMuted?: boolean;
}

export function ChatHeader({
  channel,
  onViewMembers,
  onOpenSettings,
  onToggleNotifications,
  notificationsMuted = false,
}: ChatHeaderProps) {
  return (
    <TooltipProvider>
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex w-[inherit] h-[inherit] items-center justify-between bg-background/80 px-4 backdrop-blur-sm"
      >
        {/* Left side - Channel info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {channel.isPrivate ? (
              <Lock className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Hash className="h-5 w-5 text-muted-foreground" />
            )}
            <h1 className="font-semibold text-foreground">{channel.name}</h1>
          </div>

          {channel.description && (
            <>
              <div className="h-4 w-px bg-border" />
              <p className="max-w-md truncate text-sm text-muted-foreground">
                {channel.description}
              </p>
            </>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          {/* Members */}
          {channel.memberCount !== undefined && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={onViewMembers}
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{channel.memberCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View members</TooltipContent>
            </Tooltip>
          )}

          <div className="mx-1 h-4 w-px bg-border" />

          {/* Search */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search in channel</TooltipContent>
          </Tooltip>

          {/* Pinned messages */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Pin className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pinned messages</TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  notificationsMuted
                    ? "text-muted-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={onToggleNotifications}
              >
                {notificationsMuted ? (
                  <BellOff className="h-4 w-4" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {notificationsMuted
                ? "Unmute notifications"
                : "Mute notifications"}
            </TooltipContent>
          </Tooltip>

          {/* More options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onViewMembers}>
                <Users className="mr-2 h-4 w-4" />
                View members
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pin className="mr-2 h-4 w-4" />
                Pinned messages
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onOpenSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Channel settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}

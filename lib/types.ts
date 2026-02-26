export type CommonErrorCode =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limit"
  | "server_error";

export interface ApiResponse<T> {
  result: {
    data: T;
  };
}

import { Channels, Users, Workspaces } from "./db/schema";

export type WorkspaceWithOwner = Workspaces & {
  owner: Users;
};

export type ChannelWithCreator = Channels & {
  creator: Users;
  memberCount?: number;
};

import { VideoChannelSharedBetweenUserModel } from "@shared/models/users/videoChannelSharedBetweenUser.model";

export interface VideoChannelUpdate {
  displayName?: string;
  description?: string;
  shareChannelBetweenUser?: string[];
  support?: string;

  bulkVideosSupportUpdate?: boolean;
}

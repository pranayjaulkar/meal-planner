import type { HealthProfile } from "../profile/types";

export interface UserAttrs {
  name: string;
  email: string;
  password: string;
  healthProfile?: HealthProfile;
}

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  healthProfile?: HealthProfile;
  createdAt: Date;
  updatedAt: Date;
}

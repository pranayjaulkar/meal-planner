export interface UserAttrs {
  name: string;
  email: string;
  password: string;
}

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

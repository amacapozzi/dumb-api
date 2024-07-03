export interface User {
  username: string;
  password: string;
  expire: Date;
  customer: boolean;
  key: string;
  hwid: string;
  isBanned: boolean;
  isAdmin: boolean;
}

export interface Key {
  key: string;
  author: string;
  used: boolean;
  expire: Date | String;
  usedBy: string;
}

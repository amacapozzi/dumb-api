export interface User {
  username: string;
  password: string;
  refreshToken: string;
  expire: Date;
  customer: boolean;
  roles: string[];
  key: string;
  hwid: string;
  isBanned: boolean;
  isAdmin: boolean;
}

interface IRole {
  roles: Role[];
}

interface Role {
  roleName: string;
}

export interface Key {
  key: string;
  author: string;
  used: boolean;
  expire: Date;
  usedBy: string;
}

export interface Loader {
  isEnabled: boolean;
  version: number;
}

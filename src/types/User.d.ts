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
}

type Cheat = "TZX" | "GOSTH" | "SUSANO" | "SKRIPT";

interface IString {
  clientName: string;
  clientHash: string;
  processName: string;
  cheatType: Cheat;
  addedBy: string;
}

interface IRole {
  roles: Role[];
}

interface Role {
  roleId: string;
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
  version: string;
}

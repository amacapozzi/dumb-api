export interface Role {
  roleName: string;
  roleId: string;
}

const adminRolesID = ["66b9774acecfddf0e776d5a7"];
const resellerRolesId = ["66b9784ececfddf0e776d5a9"];

export const isAdmin = (roles: Role[]): boolean => {
  if (roles.length < 1) return false;

  return roles.some((role) => {
    return adminRolesID.includes(role.roleId);
  });
};

export const isReseller = (roles: Role[]): boolean => {
  if (roles.length < 1) return false;

  return roles.some((role) => {
    return resellerRolesId.includes(role.roleId);
  });
};

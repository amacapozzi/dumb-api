export interface Role {
  roleName: string;
  roleId: string;
}

const adminRolesID = ["6695b227e8827a5a1af222e7"];
const resellerRolesId = ["6695b9d1e31e79c9846fd61a"];

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

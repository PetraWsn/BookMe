import { roleHierarchy } from "../constants/roleHierarchy.js";

export const resolvePermissions = (roleName, visited = new Set()) => {
  if (!roleHierarchy[roleName]) return [];

  if (visited.has(roleName)) return []; // undvik cirkulär referens
  visited.add(roleName);

  const role = roleHierarchy[roleName];

  // Börja med egna permissions
  let permissions = [...role.permissions];

  // Lägg till ärvda permissions rekursivt
  for (const inheritedRole of role.inherits) {
    permissions = permissions.concat(
      resolvePermissions(inheritedRole, visited),
    );
  }

  return permissions;
};

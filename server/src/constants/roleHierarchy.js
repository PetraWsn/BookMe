import { PERMISSIONS } from "./permissions.js";

export const roleHierarchy = {
  admin: {
    inherits: ["editor"],
    permissions: [
      PERMISSIONS.USER_READ_ALL,
      PERMISSIONS.USER_UPDATE_ALL,
      PERMISSIONS.USER_DELETE_ALL,

      PERMISSIONS.BOOKING_READ_ALL,
      PERMISSIONS.BOOKING_DELETE_ALL,
    ],
  },

  editor: {
    inherits: ["user"],
    permissions: [
      PERMISSIONS.ROOM_CREATE,
      PERMISSIONS.ROOM_UPDATE,
      PERMISSIONS.ROOM_DELETE,
    ],
  },

  user: {
    inherits: [],
    permissions: [
      PERMISSIONS.USER_CREATE_OWN,
      PERMISSIONS.USER_READ_OWN,
      PERMISSIONS.USER_UPDATE_OWN,
      PERMISSIONS.USER_DELETE_OWN,

      PERMISSIONS.ROOM_READ,

      PERMISSIONS.BOOKING_CREATE,
      PERMISSIONS.BOOKING_READ_OWN,
      PERMISSIONS.BOOKING_UPDATE_OWN,
      PERMISSIONS.BOOKING_DELETE_OWN,
    ],
  },
};

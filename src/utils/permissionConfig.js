// permissionConfig.ts
export const rolePermissions = {
  people: {
    manager: {
      root: { create: true, update: true, delete: true, read: true },
      admin: { create: false, update: false, delete: false, read: true },
    },
    pilot: {
      root: { create: true, update: true, delete: true, read: true },
      admin: { create: false, update: false, delete: false, read: true },
    },
  },
  device: {
    drones: {
      root: { create: true, update: true, delete: true, read: true },
      admin: { create: false, update: false, delete: false, read: true },
    },
    nest: {
      root: { create: true, update: true, delete: true, read: true },
      admin: { create: false, update: false, delete: false, read: true },
    },
  },
};

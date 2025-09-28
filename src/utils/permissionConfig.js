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
      root: { create: true, update: true, delete: true, read: true, dispatch: true },
      admin: { create: false, update: false, delete: false, read: true, dispatch: true },
    },
    nest: {
      root: { create: true, update: true, delete: true, read: true },
      admin: { create: false, update: false, delete: false, read: true },
    },
  },
  control: {
    route: {
      root: { create: true, update: true, delete: true, read: true },
      admin: { create: false, update: false, delete: false, read: true },
    },
    nest: {
      root: { create: true, update: true, delete: true, read: true },
      admin: { create: false, update: false, delete: false, read: true },
    },
    area: {
      root: { create: true, update: true, delete: true, read: true },
      admin: { create: false, update: false, delete: false, read: true },
    },
  },
  dashboard: {
    task: {
      root: { create: true, update: true, delete: true, read: true },
      admin: { create: false, update: false, delete: false, read: true },
    },
  },
};

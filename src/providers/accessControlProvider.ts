import { AccessControlProvider } from '@refinedev/core';
import { newEnforcer } from 'casbin';

import { adapter, model } from './accessControl';

export const accessControlProvider: AccessControlProvider = {
  can: async ({ action, params, resource }) => {
    const role = localStorage.getItem('role') ?? '';
    const enforcer = await newEnforcer(model, adapter);
    if (action === 'delete' || action === 'edit' || action === 'show') {
      return Promise.resolve({
        can: enforcer.enforceSync(role, `${resource}/${params?.id}`, action),
      });
    }
    if (action === 'field') {
      return Promise.resolve({
        can: enforcer.enforceSync(role, `${resource}/${params?.field}`, action),
      });
    }
    return {
      can: enforcer.enforceSync(role, resource, action),
    };
  },
};

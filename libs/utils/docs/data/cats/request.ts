import { getMockUUID } from 'libs/utils/tests/tests';

import { CatsCreateInput } from '@/apps/cats/src/core/use-cases/cats-create';
import { CatsUpdateInput } from '@/apps/cats/src/core/use-cases/cats-update';

export const CatsRequest = {
  create: { name: 'miau', breed: 'breed', age: 1 } as CatsCreateInput,
  update: { id: getMockUUID(), name: 'miau', breed: 'breed', age: 1 } as CatsUpdateInput
};

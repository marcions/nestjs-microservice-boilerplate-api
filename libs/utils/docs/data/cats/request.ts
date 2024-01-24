import { CatsCreateInput } from 'core/cats/use-cases/cats-create';
import { CatsUpdateInput } from 'core/cats/use-cases/cats-update';
import { getMockUUID } from 'libs/utils/tests/tests';

export const CatsRequest = {
  create: { name: 'miau', breed: 'breed', age: 1 } as CatsCreateInput,
  update: { id: getMockUUID(), name: 'miau', breed: 'breed', age: 1 } as CatsUpdateInput
};

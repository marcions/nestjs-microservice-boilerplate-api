import { DogsCreateInput } from 'core/dogs/use-cases/dogs-create';
import { DogsUpdateInput } from 'core/dogs/use-cases/dogs-update';
import { getMockUUID } from 'libs/utils/tests/tests';

export const DogsRequest = {
  create: { name: 'miau', breed: 'breed', age: 1 } as DogsCreateInput,
  update: { id: getMockUUID(), name: 'miau', breed: 'breed', age: 1 } as DogsUpdateInput
};

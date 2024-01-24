import { DogsEntity } from 'core/dogs/entity/dogs';
import { DogsCreateOutput } from 'core/dogs/use-cases/dogs-create';
import { DogsDeleteOutput } from 'core/dogs/use-cases/dogs-delete';
import { DogsGetByIDOutput } from 'core/dogs/use-cases/dogs-getByID';
import { DogsListOutput } from 'core/dogs/use-cases/dogs-list';
import { DogsUpdateOutput } from 'core/dogs/use-cases/dogs-update';
import { getMockUUID } from 'libs/utils/tests/tests';

const entity = new DogsEntity({
  name: 'Miau',
  breed: 'breed',
  age: 1
});

const fullEntity = new DogsEntity({
  ...entity,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
});

export const DogsResponse = {
  create: { created: true, id: getMockUUID() } as DogsCreateOutput,
  delete: { ...fullEntity, deletedAt: new Date() } as DogsDeleteOutput,
  update: fullEntity as DogsUpdateOutput,
  getByID: fullEntity as DogsGetByIDOutput,
  list: { docs: [fullEntity], limit: 10, page: 1, total: 1 } as DogsListOutput
};

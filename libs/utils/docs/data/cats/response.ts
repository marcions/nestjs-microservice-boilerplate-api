import { getMockUUID } from 'libs/utils/tests/tests';

import { CatsEntity } from '@/apps/common-old/src/core/cats/entity/cats';
import { CatsCreateOutput } from '@/apps/common-old/src/core/cats/use-cases/cats-create';
import { CatsDeleteOutput } from '@/apps/common-old/src/core/cats/use-cases/cats-delete';
import { CatsGetByIDOutput } from '@/apps/common-old/src/core/cats/use-cases/cats-getByID';
import { CatsListOutput } from '@/apps/common-old/src/core/cats/use-cases/cats-list';
import { CatsUpdateOutput } from '@/apps/common-old/src/core/cats/use-cases/cats-update';

const entity = new CatsEntity({
  name: 'Miau',
  breed: 'breed',
  age: 1
});

const fullEntity = new CatsEntity({
  ...entity,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
});

export const CatsResponse = {
  create: { created: true, id: getMockUUID() } as CatsCreateOutput,
  delete: { ...fullEntity, deletedAt: new Date() } as CatsDeleteOutput,
  update: fullEntity as CatsUpdateOutput,
  getByID: fullEntity as CatsGetByIDOutput,
  list: { docs: [fullEntity], limit: 10, page: 1, total: 1 } as CatsListOutput
};

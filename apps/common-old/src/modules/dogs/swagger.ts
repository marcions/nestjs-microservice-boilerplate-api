import { DogsEntity } from '@@/apps/common-old/src/core/dogs/entity/dogs';
import { DogsCreateOutput } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-create';
import { DogsDeleteOutput } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-delete';
import { DogsGetByIDOutput } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-getByID';
import { DogsListOutput } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-list';
import { DogsUpdateOutput } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-update';
import { Swagger } from '@@/libs/utils/docs/swagger';

const input = new DogsEntity({
  name: '<name>'
});

const output = new DogsEntity({ ...input, updatedAt: new Date(), createdAt: new Date(), deletedAt: null });

export const SwagggerResponse = {
  create: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: { created: true, id: '<uuid>' } as DogsCreateOutput,
      description: 'dogs created.'
    })
  },
  update: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: output as DogsUpdateOutput,
      description: 'dogs updated.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: 'api/dogs',
      message: 'dogsNotFound',
      description: 'dogs not found.'
    })
  },
  getByID: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: output as DogsGetByIDOutput,
      description: 'dogs found.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: 'api/dogs/:id',
      message: 'dogsNotFound',
      description: 'dogs not found.'
    })
  },
  delete: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: output as DogsDeleteOutput,
      description: 'dogs found.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: 'api/dogs/:id',
      message: 'dogsNotFound',
      description: 'dogs not found.'
    })
  },
  list: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: { docs: [output], page: 1, limit: 1, total: 1 } as DogsListOutput,
      description: 'dogs created.'
    })
  }
};

export const SwagggerRequest = {
  createBody: Swagger.defaultRequestJSON({ ...input, id: undefined } as DogsEntity),
  updateBody: Swagger.defaultRequestJSON({ ...input, id: '<id>' } as DogsEntity),
  listQuery: {
    pagination: {
      limit: Swagger.defaultApiQueryOptions({ example: 10, name: 'limit', required: false }),
      page: Swagger.defaultApiQueryOptions({ example: 1, name: 'page', required: false })
    },
    sort: Swagger.defaultApiQueryOptions({
      name: 'sort',
      required: false,
      description: '<b>createdAt:desc,name:asc'
    }),
    search: Swagger.defaultApiQueryOptions({
      name: 'search',
      required: false,
      description: '<b>name:miau'
    })
  }
};

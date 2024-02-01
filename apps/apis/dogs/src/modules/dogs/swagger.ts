/* eslint-disable sonarjs/no-duplicate-string */
import { DogsRequest } from 'libs/utils/docs/data/dogs/request';
import { DogsResponse } from 'libs/utils/docs/data/dogs/response';
import { Swagger } from 'libs/utils/docs/swagger';

export const SwagggerResponse = {
  create: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: DogsResponse.create,
      description: 'cat created.'
    })
  },
  update: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: DogsResponse.update,
      description: 'cat updated.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: 'api/dogs',
      message: 'dogNotFound',
      description: 'dog not found.'
    })
  },
  getByID: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: DogsResponse.getByID,
      description: 'cat found.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: 'api/dogs/:id',
      message: 'dogNotFound',
      description: 'dog not found.'
    })
  },
  delete: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: DogsResponse.delete,
      description: 'cat found.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: 'api/dogs/:id',
      message: 'dogNotFound',
      description: 'dog not found.'
    })
  },
  list: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: DogsResponse.list,
      description: 'cat created.'
    })
  }
};

export const SwagggerRequest = {
  createBody: Swagger.defaultRequestJSON(DogsRequest.create),
  updateBody: Swagger.defaultRequestJSON(DogsRequest.update),
  listQuery: {
    pagination: {
      limit: Swagger.defaultApiQueryOptions({ example: 10, name: 'limit', required: false }),
      page: Swagger.defaultApiQueryOptions({ example: 1, name: 'page', required: false })
    },
    sort: Swagger.defaultApiQueryOptions({
      name: 'sort',
      required: false,
      description: `<b>createdAt:desc,name:asc`
    }),
    search: Swagger.defaultApiQueryOptions({
      name: 'search',
      required: false,
      description: `<b>name:miau,breed:siamese`
    })
  }
};

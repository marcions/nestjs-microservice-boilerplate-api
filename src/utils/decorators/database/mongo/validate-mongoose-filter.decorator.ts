import { ApiBadRequestException } from '@/utils/exception';
import { MongoUtils } from '@/utils/mongoose';

import { AllowedFilter, SearchTypeEnum } from '../../types';

export function ConvertMongooseFilter<T>(allowedFilterList: AllowedFilter<T>[] = []) {
  return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: { search: { [key: string]: string } }[]) {
      const input = args[0];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {};

      where['deletedAt'] = null;

      if (input?.search?.id) {
        where['_id'] = input.search.id.trim();
        delete input.search.id;
      }

      const filterNameList = allowedFilterList.map((f) => f.name as string);

      Object.keys(input.search || {}).forEach((key) => {
        const allowed = filterNameList.includes(key);
        if (!allowed) throw new ApiBadRequestException(`allowed filters are: ${filterNameList.join(', ')}`);
      });

      for (const allowedFilter of allowedFilterList) {
        if (!input.search) continue;
        const filter = input.search[allowedFilter.name as string];

        if (!filter) continue;

        const regexFilter = MongoUtils.createMongoRegexText(filter);

        if (allowedFilter.type === SearchTypeEnum.equal) {
          if (typeof regexFilter === 'object') {
            where['$or'] = regexFilter.map((filter) => {
              return {
                [`${allowedFilter.map ?? (allowedFilter.name as string)}`]: filter
              };
            });
          }
          if (typeof regexFilter === 'string') {
            where[`${allowedFilter.map ?? (allowedFilter.name as string)}`] = filter;
          }
        }

        if (allowedFilter.type === SearchTypeEnum.like) {
          if (typeof regexFilter === 'object') {
            where['$or'] = regexFilter.map((filter) => {
              return {
                [`${allowedFilter.map ?? (allowedFilter.name as string)}`]: {
                  $regex: filter,
                  $options: 'i'
                }
              };
            });
          }

          if (typeof regexFilter === 'string') {
            where[`${allowedFilter.map ?? (allowedFilter.name as string)}`] = {
              $regex: MongoUtils.createMongoRegexText(filter),
              $options: 'i'
            };
          }
        }

        args[0].search = where;
        const result = originalMethod.apply(this, args);
        return result;
      }
    };
  };
}

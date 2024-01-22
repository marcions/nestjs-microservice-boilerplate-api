import { PaginationSchema } from 'libs/utils/pagination';
import { SearchSchema } from 'libs/utils/search';
import { SortSchema } from 'libs/utils/sort';
import { z } from 'zod';

export const ListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export function ConvertSequelizeFilterToRepository() {
  return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: z.infer<typeof ListSchema>[]) {
      const input = args[0];

      if (!input) {
        const result = originalMethod.apply(this, args);
        return result;
      }

      Object.assign(input, { deletedAt: null });

      args[0] = input;

      const result = originalMethod.apply(this, args);
      return result;
    };
  };
}
import { DogsCreateInput, DogsCreateOutput } from 'core/dogs/use-cases/dogs-create';
import { DogsDeleteInput, DogsDeleteOutput } from 'core/dogs/use-cases/dogs-delete';
import { DogsGetByIDInput, DogsGetByIDOutput } from 'core/dogs/use-cases/dogs-getByID';
import { DogsListInput, DogsListOutput } from 'core/dogs/use-cases/dogs-list';
import { DogsUpdateInput, DogsUpdateOutput } from 'core/dogs/use-cases/dogs-update';
import { ApiTrancingInput } from 'libs/utils/request';

export abstract class IDogsCreateAdapter {
  abstract execute(input: DogsCreateInput, trace: ApiTrancingInput): Promise<DogsCreateOutput>;
}

export abstract class IDogsUpdateAdapter {
  abstract execute(input: DogsUpdateInput, trace: ApiTrancingInput): Promise<DogsUpdateOutput>;
}

export abstract class IDogsGetByIDAdapter {
  abstract execute(input: DogsGetByIDInput): Promise<DogsGetByIDOutput>;
}

export abstract class IDogsListAdapter {
  abstract execute(input: DogsListInput): Promise<DogsListOutput>;
}

export abstract class IDogsDeleteAdapter {
  abstract execute(input: DogsDeleteInput, trace: ApiTrancingInput): Promise<DogsDeleteOutput>;
}
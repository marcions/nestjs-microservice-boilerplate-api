import { UserCreateInput, UserCreateOutput } from 'libs/core/user/use-cases/user-create';
import { UserDeleteInput, UserDeleteOutput } from 'libs/core/user/use-cases/user-delete';
import { UserGetByIDInput, UserGetByIDOutput } from 'libs/core/user/use-cases/user-getByID';
import { UserListInput, UserListOutput } from 'libs/core/user/use-cases/user-list';
import { UserUpdateInput, UserUpdateOutput } from 'libs/core/user/use-cases/user-update';
import { ApiTrancingInput } from 'libs/utils/request';

export abstract class IUserCreateAdapter {
  abstract execute(input: UserCreateInput, trace: ApiTrancingInput): Promise<UserCreateOutput>;
}

export abstract class IUserUpdateAdapter {
  abstract execute(input: UserUpdateInput, trace: ApiTrancingInput): Promise<UserUpdateOutput>;
}

export abstract class IUserListAdapter {
  abstract execute(input: UserListInput): Promise<UserListOutput>;
}

export abstract class IUserDeleteAdapter {
  abstract execute(input: UserDeleteInput, trace: ApiTrancingInput): Promise<UserDeleteOutput>;
}

export abstract class IUserGetByIDAdapter {
  abstract execute(input: UserGetByIDInput): Promise<UserGetByIDOutput>;
}

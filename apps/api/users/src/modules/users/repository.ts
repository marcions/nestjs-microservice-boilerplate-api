import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'libs/infra/database/mongo/schemas/user';
import { MongoRepository } from 'libs/infra/repository';
import { MongoRepositoryModelSessionType, MongoRepositorySession } from 'libs/utils/database/mongoose';
import { ValidateMongooseFilter } from 'libs/utils/decorators/database/mongo/validate-mongoose-filter.decorator';
import { ValidateDatabaseSortAllowed } from 'libs/utils/decorators/database/validate-database-sort-allowed.decorator';
import { SearchTypeEnum } from 'libs/utils/decorators/types';
import { PaginateModel } from 'mongoose';

import { UserEntity } from '@/core/user/entity/user';
import { IUserRepository } from '@/core/user/repository/user';
import { UserListInput, UserListOutput } from '@/core/user/use-cases/user-list';

@Injectable()
export class UserRepository extends MongoRepository<UserDocument> implements IUserRepository {
  constructor(@InjectModel(User.name) readonly entity: MongoRepositoryModelSessionType<PaginateModel<UserDocument>>) {
    super(entity);
  }

  async startSession<TTransaction = MongoRepositorySession>(): Promise<TTransaction> {
    const session = await this.entity.connection.startSession();
    session.startTransaction();

    return session as TTransaction;
  }

  async existsOnUpdate(
    equalFilter: Pick<UserEntity, 'login' | 'password'>,
    notEqualFilter: Pick<UserEntity, 'id'>
  ): Promise<boolean> {
    const user = await this.entity.findOne({ ...equalFilter, $nor: [{ _id: notEqualFilter.id }] });

    return !!user;
  }

  @ValidateMongooseFilter<UserEntity>([{ name: 'login', type: SearchTypeEnum.like }])
  @ValidateDatabaseSortAllowed<UserEntity>('login', 'createdAt')
  async paginate({ limit, page, sort, search }: UserListInput): Promise<UserListOutput> {
    const users = await this.entity.paginate(search, { page, limit, sort });

    return {
      docs: users.docs.map((u) => new UserEntity(u.toObject({ virtuals: true }))),
      limit,
      page,
      total: users.totalDocs
    };
  }
}

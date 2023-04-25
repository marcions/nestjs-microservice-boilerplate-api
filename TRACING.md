## Trancing usage

- Import the HTTP adapter in usecase adapter.

  ```
  import { IHttpAdapter } from '@/infra/http';
  import { UserCreateInput, UserCreateOutput } from './types';

  export abstract class IUserCreateAdapter {
    abstract execute(input: UserCreateInput, httpService: IHttpAdapter): Promise<UserCreateOutput>;
  }
  ```

- Get HTTP tracing and send it to the usecase adapter.

  ```
  import { Controller, Post, Req } from '@nestjs/common';
  import { ApiRequest } from '@/utils/request';
  import { IUserCreateAdapter } from './adapter';
  import { UserListOutput } from './types';

  @Controller()
  export class UserController {
    constructor(private readonly userCreate: IUserCreateAdapter) {}

    @Post('/users')
    async list(@Req() { tracing, body }: ApiRequest): UserListOutput {
      return await this.userCreate.execute(body, { instance: tracing.axios });
    }
  }
  ```

- Call the instance HTTP and magic :).

  ```
  async execute(input: UserListInput, httpService: IHttpAdapter): Promise<UserListOutput> {
    const http = httpService.instance();

    await http.post('http://localhost:4000/api/cats', input);
  }
  ```

- Access Jaeger URL
  ```
  http://0.0.0.0:16686/search
  ```
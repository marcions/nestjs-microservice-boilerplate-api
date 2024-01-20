import { UserEntity } from '@@/apps/common-old/src/core/user/entity/user';
import { ApiTrancingInput, TracingType } from '@@/libs/utils/request';

export class RequestMock {
  static trancingMock: ApiTrancingInput = {
    tracing: {
      logEvent(key, value) {
        return key + value;
      },
      setStatus(event) {
        return event;
      }
    } as Partial<TracingType> as TracingType,
    user: { login: 'test' } as UserEntity
  };
}

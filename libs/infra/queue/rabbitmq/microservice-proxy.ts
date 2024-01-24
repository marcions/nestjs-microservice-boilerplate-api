import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Microservice } from 'libs/utils/enum/index';
import { MicroservicePattern, MicroserviceType } from 'libs/utils/type/index';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MicroserviceProxy {
  public static readonly MICROSERVICE_PROXY_SERVICE = 'MICROSERVICE_PROXY_SERVICE';

  constructor(
    @Inject(Microservice.DOGS) private readonly microserviceDogs: ClientProxy,
    @Inject(Microservice.USER) private readonly microserviceUser: ClientProxy
  ) {}

  public async message(
    microserviceName: MicroserviceType,
    pattern: MicroservicePattern,
    message: unknown | unknown[]
  ): Promise<unknown> {
    const microservice = this.getClientProxyByMicroservice(microserviceName);

    return lastValueFrom(microservice.send(pattern, message));
  }

  public async event(
    microserviceName: MicroserviceType,
    pattern: MicroservicePattern,
    message: unknown | unknown[]
  ): Promise<unknown> {
    const microservice = this.getClientProxyByMicroservice(microserviceName);

    return lastValueFrom(microservice.emit(pattern, message));
  }

  public getClientProxyByMicroservice(name: MicroserviceType): ClientProxy {
    const microservice = {
      [Microservice.DOGS]: () => this.microserviceDogs,
      [Microservice.USER]: () => this.microserviceUser
    };

    // eslint-disable-next-line security/detect-object-injection
    return microservice[name]();
  }
}

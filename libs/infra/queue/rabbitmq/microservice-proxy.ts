import { Microservice } from '@libs/utils/enum/index';
import { MicroserviceType } from '@libs/utils/type/index';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MicroserviceProxy {
  public static readonly MICROSERVICE_PROXY_SERVICE = 'MICROSERVICE_PROXY_SERVICE';

  constructor(
    @Inject(Microservice.PRODUCT) private readonly microserviceProduct: ClientProxy,
    @Inject(Microservice.PRODUCT_PRICE) private readonly microserviceProductPrice: ClientProxy,
    @Inject(Microservice.USER) private readonly microserviceUser: ClientProxy,
    @Inject(Microservice.CART) private readonly microserviceCart: ClientProxy,
    @Inject(Microservice.CHECKOUT) private readonly microserviceCheckout: ClientProxy
  ) {}

  public async message(
    microserviceName: MicroserviceType,
    pattern: MicroservicePattern,
    message: any | any[]
  ): Promise<any> {
    const microservice = this.getClientProxyByMicroservice(microserviceName);

    return lastValueFrom(microservice.send(pattern, message));
  }

  public async event(
    microserviceName: MicroserviceType,
    pattern: MicroservicePattern,
    message: any | any[]
  ): Promise<any> {
    const microservice = this.getClientProxyByMicroservice(microserviceName);

    return lastValueFrom(microservice.emit(pattern, message));
  }

  public getClientProxyByMicroservice(name: MicroserviceType): ClientProxy {
    const microservice = {
      [Microservice.PRODUCT]: () => this.microserviceProduct,
      [Microservice.PRODUCT_PRICE]: () => this.microserviceProductPrice,
      [Microservice.USER]: () => this.microserviceUser,
      [Microservice.CART]: () => this.microserviceCart,
      [Microservice.CHECKOUT]: () => this.microserviceCheckout
    };

    return microservice[name]();
  }
}

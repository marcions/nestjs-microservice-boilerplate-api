import { Microservice } from '@lib/enum/index';

export type MicroserviceType =
	| Microservice.API
	| Microservice.PRODUCT
	| Microservice.PRODUCT_PRICE
	| Microservice.USER
	| Microservice.CART
	| Microservice.CHECKOUT;

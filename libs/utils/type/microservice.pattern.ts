import { CartPattern, CheckoutPattern, ProductPattern, ProductPricePattern, UserPattern } from 'libs/utils/enum/index';

export type MicroservicePattern = ProductPattern | ProductPricePattern | UserPattern | CartPattern | CheckoutPattern;

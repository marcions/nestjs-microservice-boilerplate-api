export enum ProductPattern {
  GET_PRODUCT = 'product.getProduct',
  POST_PRODUCT = 'product.postProduct',
  UPDATE_PRODUCT = 'product.updateProduct',
  REMOVE_PRODUCT = 'product.removeProduct'
}

export enum ProductPricePattern {
  GET_PRODUCT_PRICE = 'productPrice.getProductPrice',
  POST_PRODUCT_PRICE = 'productPrice.postProductPrice',
  UPDATE_PRODUCT_PRICE = 'productPrice.updateProductPrice',
  REMOVE_PRODUCT_PRICE = 'productPrice.removeProductPrice'
}

export enum UserPattern {
  GET_USER = 'user.getUser',
  POST_USER = 'user.postUser',
  UPDATE_USER = 'user.updateUser',
  REMOVE_USER = 'user.removeUser'
}

export enum CartPattern {
  GET_CART = 'cart.getCart',
  POST_CART = 'cart.postCart',
  UPDATE_CART = 'cart.updateCart',
  SET_CART_DEFAULT = 'cart.setCartDefault',
  POST_CART_ITEM = 'cart.postCartItem',
  REMOVE_ITEM_FROM_CART = 'cart.removeCartItem',
  REMOVE_CART = 'cart.removeCart'
}

export enum CheckoutPattern {
  GET_ORDER = 'checkout.getOrder',
  CREATE_ORDER = 'checkout.createOrder',
  UPDATE_ORDER = 'checkout.updateOrder',
  REMOVE_ORDER = 'checkout.removeOrder',
  GET_ORDER_ITEMS = 'checkout.getOrderItems',
  CREATE_ORDER_ITEMS = 'checkout.createOrderItems',
  UPDATE_ORDER_ITEMS = 'checkout.updateOrderItems',
  REMOVE_ORDER_ITEMS = 'checkout.removeOrderItems',
  GET_PAYMENTS = 'checkout.getPayments',
  POST_PAYMENTS = 'checkout.postPayments',
  UPDATE_PAYMENTS = 'checkout.updatePayments',
  REMOVE_PAYMENTS = 'checkout.removePayments'
}

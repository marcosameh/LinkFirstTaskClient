export interface CreateOrderItem {
    productId: number;
    quantity: number;
  }
  
  export interface CreateOrder {
    orderItems: CreateOrderItem[];
  }
  
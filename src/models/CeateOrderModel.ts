export interface CreateOrderItemDto {
    productId: number;
    quantity: number;
  }
  
  export interface CreateOrderDto {
    orderItems: CreateOrderItemDto[];
  }
  
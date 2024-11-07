export interface Order {
    orderId: number;
    orderItems: OrderItem[];
    totalPrice: number;
  }
  
  export interface OrderItem {
    productId: number;
    quantity: number;
    name: string;
  }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { ApiResponse } from '../models/ApiResponse.model';
import { SubmitOrder } from '../models/SubmitOrder.model';
import { CreateOrder } from '../models/CreateOrder.model';
import { Order } from '../models/Order.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.baseUrl}/api/order`;

  constructor(private http: HttpClient) {}

  // Create a new order
  createOrder(orderDto: CreateOrder): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.apiUrl}`, orderDto);
  }

  // Get an order by ID
  getOrder(orderId: number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${orderId}`);
  }

  // Submit an order
  submitOrder(orderDto: SubmitOrder): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.apiUrl}/submit`, orderDto);
  }
}

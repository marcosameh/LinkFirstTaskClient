import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../models/Order.model';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderId!: number;
  order!: Order;
  customerName = '';
  customerPhone = '';
  customerAddress = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.orderId = Number(paramMap.get('id'));
      this.LoadOrder(this.orderId); 
    });
  }

  LoadOrder(id: number): void {
    this.orderService.getOrder(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.order = res.data;        
        } else {
          this.toastr.error('Failed to load order', res.errors.join(', '));
        }
      },
      error: (err) => {
        this.toastr.error('An error occurred while fetching the order', err);
      }
    });
  }

  onSubmit(): void {
    const submitOrderData = {
      orderId: this.orderId,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      customerAddress: this.customerAddress
    };

    this.orderService.submitOrder(submitOrderData).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Order submitted successfully!', 'Success');
        } else {
          this.toastr.error('Failed to submit order', res.errors.join(', '));
        }
      },
      error: (err) => {
        this.toastr.error('An error occurred while submitting the order', 'Error');
        console.error('Error submitting order:', err);
      }
    });
  }
}

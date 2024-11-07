import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/Order.model';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderId!: number;
  order!: Order;
  customerForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router:Router
  ) {}

  ngOnInit(): void {
    // Initialize the customer form with validation
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      customerAddress: ['', Validators.required]
    });

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
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const submitOrderData = {
      orderId: this.orderId,
      customerName:this.customerForm.get('customerName')?.value ,
      customerPhone:this.customerForm.get('customerPhone')?.value,
      customerAddress:this.customerForm.get('customerAddress')?.value

    };

    this.orderService.submitOrder(submitOrderData).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Order submitted successfully!', 'Success');
          this.router.navigateByUrl('')
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

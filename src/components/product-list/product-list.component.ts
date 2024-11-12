import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product.model';
import { PaginationFilter } from '../../models/PaginationFilter.model';
import { CreateOrder } from '../../models/CreateOrder.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchValue = '';
  totalRecords: number = 0;
  paginationFilter: PaginationFilter = {
    start: 0,
    length: 10,
    searchValue: '',
    sortColumn: 'name',
    sortDirection: 'asc'
  };
  pages: number[] = [];

  // Create a map to store the quantities for each product
  orderItems: { productId: number, quantity: number }[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts(this.paginationFilter).subscribe(response => {
      if (response.success) {
        this.products = response.data.data;
        this.totalRecords = response.data.totalRecords;
        this.pages = Array.from({ length: Math.ceil(this.totalRecords / this.paginationFilter.length) }, (_, i) => i + 1);
        
        // Initialize orderItems array with default quantities
        this.orderItems = this.products.map(product => ({ productId: product.id, quantity: 0 }));
      } else {
        console.error('Failed to fetch products:', response.errors);
      }
    });
  }

  onPageChange(page: number): void {
    this.paginationFilter.start = (page - 1) * this.paginationFilter.length;
    this.loadProducts();
  }

  onSort(column: string, direction: string): void {
    this.paginationFilter.sortColumn = column;
    this.paginationFilter.sortDirection = direction;
    this.loadProducts();
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.paginationFilter.searchValue = inputElement.value;
    this.loadProducts();
  }

  // Method to handle quantity change
  onQuantityChange(productId: number, quantity: number): void {
    const item = this.orderItems.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  // Create an order for all selected products
  createOrder(): void {
    const itemsToOrder = this.orderItems.filter(item => item.quantity > 0);

    if (itemsToOrder.length === 0) {
      this.toastr.error('Please select at least one product to order', 'Error');
      return;
    }

    const newOrder: CreateOrder = {
      orderItems: itemsToOrder
    };

    this.orderService.createOrder(newOrder).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Order created successfully!', 'Success');
          this.router.navigate(['/Order', res.data]); 
        } else {
          this.toastr.error('Failed to create order', res.errors.join(', '));
        }
      },
      error: (err) => {
        this.toastr.error('An error occurred while creating the order', 'Error');
        console.error('Error creating order:', err);
      }
    });
  }
}

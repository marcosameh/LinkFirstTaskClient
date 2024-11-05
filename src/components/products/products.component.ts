import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product.model';
import { PaginationFilter } from '../../models/paginationfilter.model';
import { DataTablesModule } from "angular-datatables";
import { Subject } from 'rxjs';
import { Config } from 'datatables.net';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [DataTablesModule, CommonModule,FormsModule],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  totalRecords: number = 0;
  dtoptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();

  // Add an array to track quantities for each product
  quantities: number[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.dtoptions = {
      pagingType: 'full_numbers'
    };
  }

  loadProducts(): void {
    const paginationFilter: PaginationFilter = { start: 0, length: 10 };
    this.productService.getProducts(paginationFilter).subscribe(response => {
      if (response.success) {
        this.products = response.data.data;
        this.totalRecords = response.data.totalRecords;
        
        // Initialize the quantities array with default values (1 for each product)
        this.quantities = new Array(this.products.length).fill(1);
        
        this.dtTrigger.next(null);
      } else {
        console.error(response.errors);
      }
    });
  }

  // Add to cart function accepting product and quantity
  addToCart(product: Product, quantity: number): void {
    console.log(`Adding ${quantity} of ${product.name} to cart`);
    // Logic to add the product with the specified quantity to the cart
  }
}

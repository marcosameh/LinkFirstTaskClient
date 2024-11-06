import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product.model';
import { PaginationFilter } from '../../models/PaginationFilter.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  totalRecords: number = 0;
  paginationFilter: PaginationFilter = {
    start: 0,
    length: 10,
    searchValue: '',
    sortColumn: 'name',
    sortDirection: 'asc'
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts(this.paginationFilter).subscribe(response => {
      if (response.success) {
        this.products = response.data.data;
        this.totalRecords = response.data.totalRecords;
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
}

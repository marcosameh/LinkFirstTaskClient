import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product.model';
import { PaginationFilter } from '../../models/PaginationFilter.model';
import { Config } from 'datatables.net';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-product-list',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [DataTablesModule],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  totalRecords: number = 0;
  dtoptions: Config = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.dtoptions = {
      serverSide: true,
      processing: true,
      pagingType: 'full_numbers',
      ajax: (dataTablesParameters: any, callback) => {
        const paginationFilter: PaginationFilter = {
          start: dataTablesParameters.start,
          length: dataTablesParameters.length,
          searchValue: dataTablesParameters.search.value || '',
          sortColumn: dataTablesParameters.columns[dataTablesParameters.order[0].column].data,
          sortDirection: dataTablesParameters.order[0].dir
        };

        this.productService.getProducts(paginationFilter).subscribe(response => {
          if (response.success) {
            this.products = response.data.data;
            this.totalRecords = response.data.totalRecords;

            callback({
              recordsTotal: this.totalRecords,
              recordsFiltered: this.totalRecords,
              data: this.products
            });
          } else {
            console.error(response.errors);
          }
        });
      },
      columns: [
        { data: 'id' },
        { data: 'name' },
        {
          data: 'photo',
          render: (data) => `<img src="${data}" alt="Product Image" style="width: 100px; height: auto;">`
        },
        { data: 'price', render: (data) => `${data} $` },
        {
          data: null,
          orderable: false,
          render: (data, type, row, meta) => `
            <input type="number" class="form-control quantity-input" id="quantity-${row.id}" value="1" min="1" />
          `
        },
        {
          data: null,
          orderable: false,
          render: (data, type, row, meta) => `
            <button class="btn btn-success add-to-cart" onclick="addToCart(${row.id})">
              <i class="fas fa-cart-plus"></i> Add
            </button>
          `
        }
      ]
    };
  }
  addToCart(productId: number): void {
    const quantityInput = document.getElementById(`quantity-${productId}`) as HTMLInputElement;
    const quantity = parseInt(quantityInput.value, 10);
  
    if (quantity > 0) {
      console.log(`Adding ${quantity} of product ID ${productId} to cart`);
      // Implement the actual logic to add the product to the cart
    } else {
      console.error("Quantity must be greater than 0");
    }
  }
  
}

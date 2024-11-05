import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product.model';
import { PaginationFilter } from '../../models/paginationfilter.model';
import {DataTablesModule} from "angular-datatables";
import { Subject } from 'rxjs';
import { Config } from 'datatables.net';


@Component({
  selector: 'app-product-list',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports:[DataTablesModule],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  totalRecords: number = 0;
  dtoptions: Config= {};
  dtTrigger:Subject<any>=new Subject<any>();
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.dtoptions = {
      pagingType: 'full_numbers'
     };
    this.dtTrigger.next(null);
  }

  loadProducts(): void {
    const paginationFilter: PaginationFilter = { start: 0, length: 10 };
    this.productService.getProducts(paginationFilter).subscribe(response => {
      if (response.success) {
        this.products = response.data.data;
        this.totalRecords = response.data.totalRecords;
      } else {
        console.error(response.errors);
      }
      console.log(response);
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse.model';
import { PaginationResult } from '../models/PaginationResult.model';
import { Product } from '../models/Product.model';
import { environment } from '../environments/environment.development';
import { PaginationFilter } from '../models/PaginationFilter.model';




@Injectable({
  providedIn: 'root'
})
export class ProductService {
 

  constructor(private http: HttpClient) { }

  getProducts(paginationFilter: PaginationFilter): Observable<ApiResponse<PaginationResult<Product>>> {
    let params = new HttpParams()
      .set('Start', paginationFilter.start.toString())
      .set('Length', paginationFilter.length.toString());
  
    if (paginationFilter.searchValue) {
      params = params.set('SearchValue', paginationFilter.searchValue);
    }
  
    if (paginationFilter.sortColumn) {
      params = params.set('SortColumn', paginationFilter.sortColumn);
    }
  
    if (paginationFilter.sortDirection) {
      params = params.set('SortDirection', paginationFilter.sortDirection);
    }
  
    return this.http.get<ApiResponse<PaginationResult<Product>>>(`${environment.baseUrl}/api/product`, { params });
  }
  
}

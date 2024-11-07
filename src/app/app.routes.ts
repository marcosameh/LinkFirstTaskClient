import { Routes } from '@angular/router';
import { ProductListComponent } from '../components/product-list/product-list.component';
import { OrderComponent } from '../components/order/order.component';

export const routes: Routes =
 [
    { path: 'Products', component: ProductListComponent },
    { path: 'Order/:id', component: OrderComponent },
    { path: '', redirectTo: '/Products', pathMatch: 'full' }
 ];

import { Component } from '@angular/core';
import { ProductCardComponent } from '../../components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  standalone: true,
})
export class ProductListComponent {}

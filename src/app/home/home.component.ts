import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { PriceService } from '../services/price.service';
import { Price } from '../types/price.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public prices$: Observable<Price[]> = new BehaviorSubject([]);

  constructor(private readonly _priceService: PriceService) {}

  ngOnInit(): void {
    this.prices$ = this._priceService.getPrices();

    const minute = 60 * 1_000;
    setInterval(() => {
      this.prices$ = this._priceService.getPrices();
    }, minute);
  }
}

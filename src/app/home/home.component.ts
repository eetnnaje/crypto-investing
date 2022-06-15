import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PriceService } from '../services/price.service';
import { Price } from '../types/price.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public prices: Price[] = [];

  constructor(private readonly _priceService: PriceService) {}

  ngOnInit(): void {
    this._priceService.getPrices().subscribe((prices) => {
      this.prices = prices;
    });

    const minute = 60 * 1_000;
    setInterval(() => {
      this._priceService.getPrices().subscribe((prices) => {
        this.prices = prices;
      });
    }, minute);
  }

  getPrice(symbol: string): Price | undefined {
    return this.prices.find(({ symbol: s }) => symbol === s);
  }
}

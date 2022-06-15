import { Component, OnInit } from '@angular/core';
import { PriceService } from '../services/price.service';
import { Price } from '../types/price.type';

export type Token = {
  [key: string]: number;
};

export type Tokens = {
  [key: string]: Token;
};

const TOKEN = { price: 0, amount: 0, value: 0 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public investment: number = 0;
  public extras: number = 0;
  public token: Tokens = {
    busd: TOKEN,
    btc: TOKEN,
    eth: TOKEN,
    axs: TOKEN,
  };
  public prices: Price[] = [];

  constructor(private priceService: PriceService) {}

  ngOnInit(): void {
    this.priceService.getPrices().subscribe((prices) => {
      this.prices = prices;
    });

    const minute = 60 * 1_000;
    setInterval(() => {
      this.priceService.getPrices().subscribe((prices) => {
        this.prices = prices;
      });
    }, minute);
  }

  handleInvestment(amount: number): void {
    this.investment = amount;
  }

  handleExtras(amount: number): void {
    this.extras = amount;
  }

  getPrice(symbol: string): number {
    const price = this.prices.find(({ symbol: s }) => symbol === s);
    if (price) return +price.price;
    return 0;
  }

  handleTokenValue(token: string, amount: number): void {
    const symbol = [token.toUpperCase(), 'BUSD'].join('');
    const price = this.getPrice(symbol);
    const value = amount * price;
    this.token[token] = { amount, price, value };
  }

  handleStableCoinValue(stableCoin: string, amount: number): void {
    const symbol = stableCoin.toLowerCase();
    const price = amount;
    const value = amount;
    this.token[symbol] = { amount, price, value };
  }
}

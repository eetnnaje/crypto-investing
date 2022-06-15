import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PriceService } from '../services/price.service';
import { Price } from '../types/price.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('fiatMonthly') fiatMonthly!: ElementRef;
  @ViewChild('multiplierMonth') multiplierMonth!: ElementRef;
  @ViewChild('fiatAdditional') fiatAdditional!: ElementRef;
  @ViewChild('fiatAdvanced') fiatAdvanced!: ElementRef;
  @ViewChild('fiatBUSD') fiatBUSD!: ElementRef;

  public totalFiat = 0;
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

  getPrice(symbol: string): number {
    const price = this.prices.find(({ symbol: s }) => symbol === s);
    if (price) return +price.price;
    return 0;
  }

  euro2dollar(value: number): number {
    const symbol = 'EURBUSD';
    const dollar = this.getPrice(symbol);
    return value * dollar;
  }

  dollar2euro(value: number): number {
    const symbol = 'EURBUSD';
    const dollar = this.getPrice(symbol);
    return value / dollar;
  }

  handleChange(): void {
    this.totalFiat = [
      +this.euro2dollar(
        this.fiatMonthly.nativeElement.value *
          +this.multiplierMonth.nativeElement.value
      ),
      +this.euro2dollar(this.fiatAdditional.nativeElement.value),
      +this.euro2dollar(this.fiatAdvanced.nativeElement.value),
      +this.dollar2euro(this.fiatBUSD.nativeElement.value),
    ].reduce((prev, curr) => prev + curr, 0);
  }
}

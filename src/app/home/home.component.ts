import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PriceService } from '../services/price.service';
import { exchangeRate, Price } from '../types/price.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('fiatMonthly') fiatMonthly!: ElementRef;
  @ViewChild('multiplierMonth') multiplierMonth!: ElementRef;
  @ViewChild('fiatAdditional') fiatAdditional!: ElementRef;
  @ViewChild('fiatAdvanced') fiatAdvanced!: ElementRef;
  @ViewChild('fiatBUSD') fiatBUSD!: ElementRef;
  @ViewChild('exchangeRamp') exchangeRamp!: ElementRef;

  @ViewChild('cryptoEth') cryptoEth!: ElementRef;
  @ViewChild('multiplierEth') multiplierEth!: ElementRef;
  @ViewChild('cryptoAxs') cryptoAxs!: ElementRef;
  @ViewChild('cryptoRon') cryptoRon!: ElementRef;

  public gain: number = 0;
  public loss: number = 0;

  public budget = 0;
  public remainingFiat = 0;
  public totalCrypto = 0;
  public prices: Price[] = [];
  public exchangeRate!: exchangeRate

  constructor(private priceService: PriceService) {}

  ngOnInit(): void {
    this.priceService.getPrices().subscribe((prices) => {
      this.prices = prices;
    });

    const minute = 60 * 1_000;
    setInterval(
      () =>
        this.priceService
          .getPrices()
          .subscribe((prices) => (this.prices = prices)),
      minute
    );
  }

  ngAfterViewInit(): void {
    this.fiatMonthly.nativeElement.value = (
      ([3068.31, 3479.49, 3454.4, 3454.4, 3423.1, 3518.06, 400 * 6].reduce(
        (prev, curr) => prev + curr,
        0
      ) /
        6) *
      0.2
    ).toFixed(2);
    this.multiplierMonth.nativeElement.value = 6;
    this.fiatAdditional.nativeElement.value = (
      [1370.46, 342.9].reduce((prev, curr) => prev + curr, 0) * 0.2
    ).toFixed(2);
    this.fiatAdvanced.nativeElement.value = 0;
    this.fiatBUSD.nativeElement.value = 0;
    this.exchangeRamp.nativeElement.value = [
      // Jan
      37.34, 50.0, 100.0, 100.0, 100.0, 200.0, 50.0, 50.0, 517.36, 200.0, 80.0,
      // Feb
      70.0, 80.0, 100.0, 68.58, 200.0, 195.9, 200.0,
      // Mar
      100.0, 100.0, 200.0, 39.0, 82.0, 120.0, 200.0,
      // Apr
      80.0, 40.0, 50.0, 80.0, 201.0,
      // May
      345.0, 345.0, 531.0, 319.0, 166.0,
      // Jun
      50.0, 50.0, 783.0, 553.0, 150.0,
    ]
      .reduce((prev, curr) => prev + curr, 0)
      .toFixed(2);
    this.cryptoEth.nativeElement.value = +[
      1.64, // ilv land
      2.2, // ai land
    ]
      .reduce((prev, curr) => prev + curr, 0)
      .toFixed(2);
    this.multiplierEth.nativeElement.value = 1;
    this.cryptoAxs.nativeElement.value = (8.37).toFixed(2);
    this.cryptoRon.nativeElement.value = 0;

    this.priceService.getExchangeRates().subscribe(rate => {
      this.exchangeRate = rate;
    });

    const minute = 1 * 1_000;
    setTimeout(() => this.handleChange(), minute);
  }

  getPrice(symbol: string): number {
    symbol = symbol.toLocaleUpperCase();
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

  crypto2dollar(symbol: string, value: number): number {
    const price = this.getPrice(symbol);
    return value * price;
  }

  crypto2dollarExchange(symbol: string, value: number): number {
    const price = this.getPrice(symbol);
    return value * price;
  }

  crypto2euro(symbol: string, value: number): number {
    const price = this.getPrice(symbol);
    const euro = this.getPrice('EURBUSD');
    return (value * price) / euro;
  }

  handleChange(): void {
    this.budget = [
      +this.fiatMonthly.nativeElement.value *
        +this.multiplierMonth.nativeElement.value,
      +this.fiatAdditional.nativeElement.value,
    ].reduce((prev, curr) => prev + curr, 0);
    this.remainingFiat =
      [
        this.budget,
        +this.fiatAdvanced.nativeElement.value,
        +this.dollar2euro(this.fiatBUSD.nativeElement.value),
      ].reduce((prev, curr) => prev + curr, 0) -
      +this.exchangeRamp.nativeElement.value;

    this.totalCrypto = [
      this.crypto2dollar(
        'ethbusd',
        this.cryptoEth.nativeElement.value *
          +this.multiplierEth.nativeElement.value
      ),
      this.crypto2dollar('axsbusd', this.cryptoAxs.nativeElement.value),
      this.cryptoRon.nativeElement.value * this.exchangeRate.data.exchangeRate.ron.usd,
    ].reduce((prev, curr) => prev + curr, 0);

    this.gain = this.totalCrypto - this.budget;
    this.loss = this.budget - this.totalCrypto;
  }
}

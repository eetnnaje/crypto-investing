import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Price } from '../types/price.type';

const API_URL = 'https://api.binance.com/api/v3';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  constructor(private readonly _httpClient: HttpClient) {}

  getPrices(): Observable<Price[]> {
    const url = `${API_URL}/ticker/price`;
    return this._httpClient.get<Price[]>(url);
  }

  getPrice(symbol: string): Observable<Price> {
    const url = `${API_URL}/ticker/price?symbol=${symbol}`;
    return this._httpClient.get<Price>(url);
  }
}

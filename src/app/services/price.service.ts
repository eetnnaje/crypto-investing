import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exchangeRate, Price } from '../types/price.type';

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

  getExchangeRates(): Observable<exchangeRate> {
    const url = 'https://graphql-gateway.axieinfinity.com/graphql';
    const data = {
      operationName: 'NewEthExchangeRate',
      variables: {},
      query: `
        query NewEthExchangeRate {
          exchangeRate {
            eth {
              usd
              __typename
            }
            slp {
              usd
              __typename
            }
            ron {
              usd
              __typename
            }
            axs {
              usd
              __typename
            } usd {
              usd
              __typename
            }
            __typename
          }
        }
      `,
    };
    return this._httpClient.post<exchangeRate>(url, data);
  }
}

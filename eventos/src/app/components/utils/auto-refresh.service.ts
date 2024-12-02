// auto-refresh.service.ts
import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoRefreshService {

  constructor() { }

  startAutoRefresh(intervalInSeconds: number): Observable<number> {
    return interval(intervalInSeconds * 1000); // Converte segundos para milissegundos
  }
}

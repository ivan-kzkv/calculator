import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ElectronService } from './electron.service';
import { Calculation } from '../models/calculation.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private historySubject = new BehaviorSubject<Calculation[]>([]);
  history$ = this.historySubject.asObservable();

  constructor(private electronService: ElectronService) {
    this.loadHistory();
  }

  private loadHistory() {
    this.electronService.once('get-history-response', (history: Calculation[]) => {
      this.historySubject.next(Array.isArray(history) ? history : []);
    });
    this.electronService.send('get-history');
  }

  updateHistory(history: Calculation[]) {
    this.historySubject.next(Array.isArray(history) ? history : []);
  }

  getHistory(): Observable<Calculation[]> {
    return this.history$;
  }

  deleteHistoryItem(id: string): Observable<void> {
    return new Observable<void>(observer => {
      this.electronService.once('delete-history-response', () => {
        this.loadHistory();
        observer.next();
        observer.complete();
      });

      this.electronService.send('delete-history-item', { id });
    });
  }
} 
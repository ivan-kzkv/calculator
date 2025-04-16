import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { HistoryService } from '../../services/history.service';
import { Calculation } from '../../models/calculation.model';
import { Operation } from '../../models/operation.enum';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, ClarityModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  historyItems: Calculation[] = [];
  deleteModalOpen = false;
  itemToDelete: Calculation | null = null;
  isDeleting = false;

  constructor(
    private historyService: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.historyService.history$.subscribe(history => {
      this.historyItems = history;
      this.cdr.detectChanges();
    });
  }

  getOperationSymbol(operation: Operation): string {
    switch (operation) {
      case Operation.ADD: return '+';
      case Operation.SUBTRACT: return '-';
      case Operation.MULTIPLY: return '×';
      case Operation.DIVIDE: return '÷';
      default: return '';
    }
  }

  confirmDelete(item: Calculation) {
    this.itemToDelete = item;
    this.deleteModalOpen = true;

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  deleteHistoryItem() {
    if (this.itemToDelete?.id && !this.isDeleting) {
      this.isDeleting = true;
      this.deleteModalOpen = false; // Close modal immediately

      this.historyService.deleteHistoryItem(this.itemToDelete.id).subscribe({
        next: () => {
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Error deleting history item:', error);
          this.cancelDelete();
        }
      });
    }
  }

  cancelDelete() {
    this.deleteModalOpen = false;
    this.itemToDelete = null;
    this.isDeleting = false;
    this.cdr.detectChanges();
  }
}

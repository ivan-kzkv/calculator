import { Component, ChangeDetectorRef, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { CalculationService } from '../../services/calculation.service';
import { Operation } from '../../models/operation.enum';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ClarityModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InputComponent {
  calculatorForm: FormGroup;
  currentOperation: string = '';
  result: number | null = null;
  errorMessage: string | null = null;
  Operation = Operation;

  @Output() calculationComplete = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private calculationService: CalculationService,
    private cdr: ChangeDetectorRef
  ) {
    this.calculatorForm = this.fb.group({
      firstOperand: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]],
      secondOperand: ['', [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]],
      operation: ['', Validators.required]
    });

    this.calculatorForm.valueChanges.subscribe(values => {
      if (values.firstOperand && values.operation && values.secondOperand) {
        this.currentOperation = `${values.firstOperand} ${this.getOperationSymbol(values.operation)} ${values.secondOperand}`;
      } else {
        this.currentOperation = '';
      }
    });
  }

  private getOperationSymbol(operation: Operation): string {
    switch (operation) {
      case Operation.ADD:
        return '+';
      case Operation.SUBTRACT:
        return '-';
      case Operation.MULTIPLY:
        return '×';
      case Operation.DIVIDE:
        return '÷';
      default:
        return '';
    }
  }

  onSubmit(): void {
    if (this.calculatorForm.valid) {
      const { firstOperand, secondOperand, operation } = this.calculatorForm.value;
      this.errorMessage = null;
      this.result = null;

      this.calculationService.calculate(
        parseFloat(firstOperand),
        parseFloat(secondOperand),
        operation
      ).subscribe({
        next: (response) => {
          if (response.error) {
            this.errorMessage = response.error;
            this.result = null;
          } else {
            this.result = response.result;
            this.errorMessage = null;
          }
          this.cdr.detectChanges();
          this.calculationComplete.emit();
        },
        error: (error) => {
          console.error('Calculation error:', error);
          this.errorMessage = error.message || 'An error occurred during calculation';
          this.result = null;
          this.cdr.detectChanges();
        }
      });
    }
  }

  clear(): void {
    this.calculatorForm.reset();
    this.currentOperation = '';
    this.result = null;
    this.errorMessage = null;
    this.cdr.detectChanges();
  }
}

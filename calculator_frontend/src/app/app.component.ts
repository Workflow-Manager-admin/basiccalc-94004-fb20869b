import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  /**
   * Calculator display value (input/result)
   */
  display: string = '0';

  /**
   * Stores the first operand before an operation
   */
  private firstOperand: number | null = null;

  /**
   * Stores the current operation (+, -, *, /)
   */
  private operator: string | null = null;

  /**
   * If true, the next digit replaces the display
   */
  private waitingForOperand: boolean = false;

  /**
   * PUBLIC_INTERFACE
   * Handles number or decimal point button press.
   */
  inputDigit(digit: string): void {
    if (this.waitingForOperand) {
      this.display = digit === '.' ? '0.' : digit;
      this.waitingForOperand = false;
    } else {
      if (digit === '.') {
        if (!this.display.includes('.')) {
          this.display += '.';
        }
        // Do nothing if already containing decimal point.
      } else {
        this.display = this.display === '0' ? digit : this.display + digit;
      }
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Handles operator button press.
   */
  inputOperator(nextOperator: string): void {
    const inputValue = parseFloat(this.display);

    if (this.operator && this.waitingForOperand) {
      // Change operator before entering next number
      this.operator = nextOperator;
      return;
    }

    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    } else if (this.operator) {
      const result = this.performCalculation(this.operator, this.firstOperand, inputValue);
      this.display = result.toString();
      this.firstOperand = result;
    }
    this.operator = nextOperator;
    this.waitingForOperand = true;
  }

  /**
   * PUBLIC_INTERFACE
   * Calculates and displays the result when "=" is pressed.
   */
  calculateResult(): void {
    if (this.operator === null || this.firstOperand === null) return;

    const inputValue = parseFloat(this.display);
    const result = this.performCalculation(this.operator, this.firstOperand, inputValue);

    this.display = result.toString();
    this.firstOperand = null;
    this.operator = null;
    this.waitingForOperand = false;
  }

  /**
   * PUBLIC_INTERFACE
   * Handles clear operation (reset).
   */
  clear(): void {
    this.display = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForOperand = false;
  }

  /**
   * PUBLIC_INTERFACE
   * Returns true if the button corresponds to the current operator (for highlighting).
   */
  isActiveOperator(op: string): boolean {
    return this.operator === op && this.waitingForOperand;
  }

  /**
   * Perform the arithmetic calculation.
   */
  private performCalculation(operator: string, firstOperand: number, secondOperand: number): number {
    switch (operator) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '*': return firstOperand * secondOperand;
      case '/': return secondOperand !== 0 ? firstOperand / secondOperand : NaN;
      default: return secondOperand;
    }
  }
}

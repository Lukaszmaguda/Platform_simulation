import { Operation } from "../models/Operation";

export class OperationService {
  private operations: Operation[] = [];

  recordOperation(
    userId: string,
    type: string,
    currency: "PLN" | "EUR" | "USD",
    amount: number
  ): void {
    const operation = new Operation(userId, type, currency, amount);
    this.operations.push(operation);
  }

  getOperationsByUser(userId: string): Operation[] {
    return this.operations.filter((op) => op.userId === userId);
  }

  getAllOperations(): Operation[] {
    return this.operations;
  }

  getOperationsByType(type: string): Operation[] {
    return this.operations.filter((op) => op.type === type);
  }

  getOperationsByCurrency(currency: "PLN" | "EUR" | "USD"): Operation[] {
    return this.operations.filter((op) => op.currency === currency);
  }

  getOperationsByDateRange(startDate: Date, endDate: Date): Operation[] {
    return this.operations.filter(
      (op) => op.date >= startDate && op.date <= endDate
    );
  }
}

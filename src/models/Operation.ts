import { v4 as uuidv4 } from "uuid";

type Currency = "PLN" | "EUR" | "USD";

export class Operation {
  userId: string;
  operationId: string;
  type: string;
  currency: Currency;
  amount: number;
  date: Date;

  constructor(
    userId: string,
    type: string,
    currency: Currency,
    amount: number
  ) {
    this.userId = userId;
    this.operationId = uuidv4();
    this.type = type;
    this.currency = currency;
    this.amount = amount;
    this.date = new Date();
  }
}

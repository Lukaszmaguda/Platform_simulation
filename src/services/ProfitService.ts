import { OperationService } from "./OperationService";

type Currency = "PLN" | "EUR" | "USD";

export class ProfitService {
  private operationService: OperationService;
  private commissionRate: number;
  private commissionTransactionRate: number;

  constructor(
    operationService: OperationService,
    commissionRate: number = 0.03,
    commissionTransactionRate: number = 0.002
  ) {
    this.operationService = operationService;
    this.commissionRate = commissionRate;
    this.commissionTransactionRate = commissionTransactionRate;
  }

  getProfit(
    startDate?: Date,
    endDate?: Date
  ): Record<string, Record<Currency, number>> {
    const profit: Record<string, Record<Currency, number>> = {};
    const operations = this.operationService.getAllOperations();

    operations.forEach((op) => {
      if (startDate && endDate && (op.date < startDate || op.date > endDate)) {
        return;
      }

      const { type, currency, amount } = op;

      if (!profit[type]) {
        profit[type] = { PLN: 0, EUR: 0, USD: 0 };
      }

      let commission = 0;
      switch (type) {
        case "DEPOSIT":
        case "WITHDRAW":
          commission = amount * this.commissionTransactionRate;
          break;
        case "TRANSFER":
        case "EXCHANGE":
          commission = amount * this.commissionRate;
          break;
        default:
          break;
      }

      profit[type][currency] += commission;
    });

    return profit;
  }
}

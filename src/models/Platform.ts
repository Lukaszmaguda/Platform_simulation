import { UserService } from "../services/UserService";
import { OperationService } from "../services/OperationService";
import { TransactionService } from "../services/TransactionService";
import { ProfitService } from "../services/ProfitService";
import { Operation } from "./Operation";

export class Platform {
  private userService: UserService;
  private operationService: OperationService;
  private transactionService: TransactionService;
  private profitService: ProfitService;

  constructor(
    commissionRate: number = 0.03,
    commissionTransactionRate: number = 0.002
  ) {
    this.userService = new UserService();
    this.operationService = new OperationService();
    this.transactionService = new TransactionService(
      this.userService,
      this.operationService,
      commissionRate,
      commissionTransactionRate
    );
    this.profitService = new ProfitService(
      this.operationService,
      commissionRate,
      commissionTransactionRate
    );
  }

  addUser(): string {
    return this.userService.addUser();
  }

  getBalance(userId: string) {
    const user = this.userService.getUser(userId);
    return user.accounts;
  }

  deposit(
    userId: string,
    amount: number,
    currency: "PLN" | "EUR" | "USD" = "PLN"
  ) {
    this.transactionService.deposit(userId, amount, currency);
  }

  withdraw(userId: string, amount: number, currency: "PLN" | "EUR" | "USD") {
    this.transactionService.withdraw(userId, amount, currency);
  }

  transfer(
    fromUserId: string,
    amount: number,
    currency: "PLN" | "EUR" | "USD" = "PLN",
    toUserId: string
  ) {
    this.transactionService.transfer(fromUserId, amount, currency, toUserId);
  }

  exchange(
    userId: string,
    amount: number,
    currencyFrom: "PLN" | "EUR" | "USD",
    currencyTo: "PLN" | "EUR" | "USD"
  ) {
    this.transactionService.exchange(userId, amount, currencyFrom, currencyTo);
  }

  getProfit() {
    return this.profitService.getProfit();
  }
  getUserTransactionHistory(userId: string): Operation[] {
    return this.operationService.getOperationsByUser(userId);
  }

  getAllTransactionHistory(): Operation[] {
    return this.operationService.getAllOperations();
  }

  getTransactionHistoryByType(type: string): Operation[] {
    return this.operationService.getOperationsByType(type);
  }

  getTransactionHistoryByCurrency(
    currency: "PLN" | "EUR" | "USD"
  ): Operation[] {
    return this.operationService.getOperationsByCurrency(currency);
  }

  getTransactionHistoryByDateRange(
    startDate: Date,
    endDate: Date
  ): Operation[] {
    return this.operationService.getOperationsByDateRange(startDate, endDate);
  }
}

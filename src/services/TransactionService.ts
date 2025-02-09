import { UserService } from "./UserService";
import { OperationService } from "./OperationService";

type Currency = "PLN" | "EUR" | "USD";

export class TransactionService {
  private commissionRate: number;
  private commissionTransactionRate: number;
  private userService: UserService;
  private operationService: OperationService;

  constructor(
    userService: UserService,
    operationService: OperationService,
    commissionRate: number = 0.03,
    commissionTransactionRate: number = 0.002
  ) {
    this.commissionRate = commissionRate;
    this.commissionTransactionRate = commissionTransactionRate;
    this.userService = userService;
    this.operationService = operationService;
  }

  private calculateAmountAfterCommission(
    amount: number,
    commissionRate: number
  ): number {
    const commission = commissionRate * amount;
    return amount - commission;
  }

  deposit(userId: string, amount: number, currency: Currency = "PLN") {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    const user = this.userService.getUser(userId);
    if (!(currency in user.accounts)) {
      throw new Error("Unsupported currency");
    }

    const amountAfterCommission = this.calculateAmountAfterCommission(
      amount,
      this.commissionTransactionRate
    );

    user.accounts[currency] += amountAfterCommission;
    this.operationService.recordOperation(
      userId,
      "DEPOSIT",
      currency,
      amountAfterCommission
    );
  }

  withdraw(userId: string, amount: number, currency: Currency) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    const user = this.userService.getUser(userId);
    if (user.accounts[currency] < amount) {
      throw new Error("Not enough funds");
    }

    if (!(currency in user.accounts)) {
      throw new Error("Unsupported currency");
    }

    const amountAfterCommission = this.calculateAmountAfterCommission(
      amount,
      this.commissionTransactionRate
    );

    user.accounts[currency] -= amount;
    this.operationService.recordOperation(
      userId,
      "WITHDRAW",
      currency,
      amountAfterCommission
    );
  }

  transfer(
    fromUserId: string,
    amount: number,
    currency: Currency = "PLN",
    toUserId: string
  ) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    if (fromUserId === toUserId) {
      throw new Error("Cannot transfer to yourself");
    }

    const fromUser = this.userService.getUser(fromUserId);
    const toUser = this.userService.getUser(toUserId);

    if (fromUser.accounts[currency] < amount) {
      throw new Error("Not enough funds");
    }

    const amountAfterCommission = this.calculateAmountAfterCommission(
      amount,
      this.commissionRate
    );

    fromUser.accounts[currency] -= amount;
    toUser.accounts[currency] += amountAfterCommission;

    this.operationService.recordOperation(
      fromUserId,
      "TRANSFER",
      currency,
      amount
    );
    this.operationService.recordOperation(
      toUserId,
      "TRANSFER",
      currency,
      amountAfterCommission
    );
  }

  exchange(
    userId: string,
    amount: number,
    currencyFrom: Currency,
    currencyTo: Currency
  ) {
    const amountAfterCommission = this.calculateAmountAfterCommission(
      amount,
      this.commissionRate
    );

    const user = this.userService.getUser(userId);
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    if (user.accounts[currencyFrom] < amount) {
      throw new Error("Insufficient funds");
    }

    if (!(currencyFrom in user.accounts) || !(currencyTo in user.accounts)) {
      throw new Error("Unsupported currency");
    }

    const exchangeKey = `${currencyFrom}-${currencyTo}`;
    const exchangeRate = this.exchangeRates[exchangeKey];

    if (!exchangeRate) {
      throw new Error("Unsupported exchange");
    }

    const exchangedAmount = amountAfterCommission * exchangeRate;

    user.accounts[currencyFrom] -= amount;
    user.accounts[currencyTo] += exchangedAmount;

    this.operationService.recordOperation(
      userId,
      "EXCHANGE",
      currencyFrom,
      amount
    );
    this.operationService.recordOperation(
      userId,
      "EXCHANGE",
      currencyTo,
      exchangedAmount
    );
  }

  private exchangeRates: Record<string, number> = {
    "PLN-EUR": 0.22,
    "PLN-USD": 0.24,
    "EUR-PLN": 4.5,
    "EUR-USD": 1.1,
    "USD-PLN": 4.2,
    "USD-EUR": 0.91,
  };
}

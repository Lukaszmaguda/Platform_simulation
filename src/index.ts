import { Platform } from "./models/Platform";

const platform = new Platform();
const user1 = platform.addUser();
const user2 = platform.addUser();

console.log("Added users:", user1, user2);

platform.deposit(user1, 1000, "PLN");
console.log("Deposited 1000 PLN into user1's account");

platform.withdraw(user1, 200, "PLN");
console.log("Withdrew 200 PLN from user1 account");

platform.transfer(user1, 300, "PLN", user2);
console.log("Transferred 300 PLN from user1 to user2");

platform.exchange(user1, 100, "PLN", "EUR");
console.log("Exchanged 100 PLN to EUR for user1");

const user1History = platform.getUserTransactionHistory(user1);
console.log("Transaction history for user1:", user1History);

const allHistory = platform.getAllTransactionHistory();
console.log("Transaction history for all users:", allHistory);

const depositHistory = platform.getTransactionHistoryByType("DEPOSIT");
console.log("Deposit history:", depositHistory);

const plnHistory = platform.getTransactionHistoryByCurrency("PLN");
console.log("Transaction history in PLN:", plnHistory);

const balanceUser1 = platform.getBalance(user1);
console.log("Account balance for user1:", balanceUser1);

const balanceUser2 = platform.getBalance(user2);
console.log("Account balance for user2:", balanceUser2);

const startDate = new Date("2025-01-01");
const endDate = new Date("2025-12-31");
const dateRangeHistory = platform.getTransactionHistoryByDateRange(
  startDate,
  endDate
);
console.log("Transaction history for the year 2025:", dateRangeHistory);

const profit = platform.getProfit();
console.log("Commission profit:", profit);

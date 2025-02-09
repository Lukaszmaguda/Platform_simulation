import { Platform } from "../src/models/Platform";

describe("Platform - Full Functionality Test", () => {
  let platform: Platform;
  let user1: string;
  let user2: string;

  beforeEach(() => {
    platform = new Platform();
    user1 = platform.addUser();
    user2 = platform.addUser();
  });

  test("should add users and return their IDs", () => {
    expect(user1).toBeDefined();
    expect(user2).toBeDefined();
    expect(user1).not.toBe(user2);
  });

  test("should deposit money and update balance correctly", () => {
    platform.deposit(user1, 1000, "PLN");
    const balance = platform.getBalance(user1);
    expect(balance.PLN).toBe(998); // 1000 - 2 PLN prowizji
  });

  test("should withdraw money and update balance correctly", () => {
    platform.deposit(user1, 1000, "PLN");
    platform.withdraw(user1, 200, "PLN");
    const balance = platform.getBalance(user1);
    expect(balance.PLN).toBe(798); // 998 - 200 + 0.4 PLN prowizji
  });

  test("should transfer money between users and update balances correctly", () => {
    platform.deposit(user1, 1000, "PLN");
    platform.transfer(user1, 300, "PLN", user2);

    const balanceUser1 = platform.getBalance(user1);
    const balanceUser2 = platform.getBalance(user2);

    expect(balanceUser1.PLN).toBe(698); // 998 - 300
    expect(balanceUser2.PLN).toBe(291); // 300 - 9 PLN prowizji
  });

  test("should exchange currency and update balances correctly", () => {
    platform.deposit(user1, 1000, "PLN");
    platform.exchange(user1, 100, "PLN", "EUR");

    const balance = platform.getBalance(user1);
    expect(balance.PLN).toBe(898); // 998 - 100 - 1 PLN prowizji
    expect(balance.EUR).toBeCloseTo(21.34); // 100 * 0.22 - 3 PLN
  });

  test("should return transaction history for a specific user", () => {
    platform.deposit(user1, 1000, "PLN");
    platform.withdraw(user1, 200, "PLN");

    const user1History = platform.getUserTransactionHistory(user1);
    expect(user1History.length).toBe(2);
    expect(user1History[0].type).toBe("DEPOSIT");
    expect(user1History[1].type).toBe("WITHDRAW");
  });

  test("should return all transaction history", () => {
    platform.deposit(user1, 1000, "PLN");
    platform.withdraw(user1, 200, "PLN");
    platform.transfer(user1, 300, "PLN", user2);

    const allHistory = platform.getAllTransactionHistory();
    expect(allHistory.length).toBe(4);
  });

  test("should return transaction history filtered by type", () => {
    platform.deposit(user1, 1000, "PLN");
    platform.withdraw(user1, 200, "PLN");
    platform.transfer(user1, 300, "PLN", user2);

    const depositHistory = platform.getTransactionHistoryByType("DEPOSIT");
    expect(depositHistory.length).toBe(1);
    expect(depositHistory[0].type).toBe("DEPOSIT");
  });

  test("should return transaction history filtered by currency", () => {
    platform.deposit(user1, 1000, "PLN");
    platform.deposit(user1, 500, "EUR");
    platform.withdraw(user1, 200, "PLN");

    const plnHistory = platform.getTransactionHistoryByCurrency("PLN");
    expect(plnHistory.length).toBe(2);
    expect(plnHistory[0].currency).toBe("PLN");
    expect(plnHistory[1].currency).toBe("PLN");
  });

  test("should return the correct balance for a user", () => {
    platform.deposit(user1, 1000, "PLN");
    platform.withdraw(user1, 200, "PLN");
    platform.transfer(user1, 300, "PLN", user2);

    const balance = platform.getBalance(user1);
    expect(balance.PLN).toBe(498); // 998 - 200 - 300
    expect(balance.EUR).toBe(0);
    expect(balance.USD).toBe(0);
  });
});

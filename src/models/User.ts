import { v4 as uuidv4 } from "uuid";

export class User {
  id: string;
  accounts: Record<string, number>;

  constructor() {
    this.id = uuidv4();
    this.accounts = {
      PLN: 0,
      EUR: 0,
      USD: 0,
    };
  }
}

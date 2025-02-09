import { User } from "../models/User";

export class UserService {
  private users: Record<string, User> = {};

  addUser(): string {
    const user = new User();
    this.users[user.id] = user;
    return user.id;
  }

  getUser(userId: string): User {
    const user = this.users[userId];
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  getUsers(): Record<string, User> {
    return this.users;
  }
}

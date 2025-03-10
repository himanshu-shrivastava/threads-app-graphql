import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";
import { prismaClient } from "../lib/db";

// Should be accessd from .env
const JWT_SECRET = "zg61/1Lt3+oGC2YxnrPW5m3bLxuy4nuTDkYY7RlNzu4=";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");
    return hashedPassword;
  }

  public static getUserById(id: string) {
    return prismaClient.user.findUnique({ where: { id } });
  }

  public static async createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;

    //Check if usser is already exist
    const user = await UserService.getUserByEmail(email);
    if (user) throw new Error("User is already exist with same email")

    // Generate random salt for each user
    const salt = randomBytes(32).toString("hex");

    // Hash password for the user
    const hashedPassword = UserService.generateHash(salt, password);

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    });
  }

  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  public static deleteUserByEmail(payload: { email: string }) {
    return prismaClient.user.delete({ where: { email: payload.email } })
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await UserService.getUserByEmail(email);
    if (!user) throw new Error("user not found");

    const userSalt = user.salt;
    const usersHashPassword = UserService.generateHash(userSalt, password);

    if (usersHashPassword !== user.password)
      throw new Error("Incorrect Password");

    // Generate Token with expiry 1h
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  }

  public static decodeJWTToken(token: string) {
    return JWT.verify(token, JWT_SECRET);
  }
}

export default UserService;

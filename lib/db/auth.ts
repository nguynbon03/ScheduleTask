import bcryptjs from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import dbConnect from "./mongoose";
import { UserModel } from "./models";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret-key"
);

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcryptjs.compare(password, hashed);
}

export async function createToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { clockTolerance: 60 });
    return payload as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string) {
  await dbConnect();
  return UserModel.findOne({ email }).lean();
}

export async function createUser(email: string, password: string, name: string) {
  await dbConnect();
  const hashed = await hashPassword(password);
  return UserModel.create({ email, password: hashed, name });
}

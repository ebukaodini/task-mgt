import { JwtPayload, sign, verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export class AuthService {
  static sign(payload: object): string {
    return sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
  }

  static verifySocket(token: string) {
    try {
      return verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      throw error;
    }
  }

  static async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (token == null) return res.error("Unauthorized", undefined, 401);

      verify(token, process.env.JWT_SECRET!, (error, payload: any) => {
        if (error) {
          return res.error("Unauthorized", undefined, 403);
        }

        req.context = payload;
        next();
      });
    } catch (error) {
      throw error;
    }
  }
  static authorize(roles: Role[]): any {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (roles.includes(req.context.role)) next();
        else return res.error("Access Denied", undefined, 403);
      } catch (error) {
        throw error;
      }
    };
  }
}

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/users.model";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request",
        success: false,
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as IUser;

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid Access Token",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth middleware failure:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export { verifyJWT };

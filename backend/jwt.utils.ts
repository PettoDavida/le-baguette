import {sign, verify} from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {Types} from "mongoose";
import {User, UserModel} from "./users/users.Model";
import {createErrorJson} from "./utils";

export interface RequestWithUser extends Request {
  user: User;
}

interface UserData {
  id: Types.ObjectId;
  isAdmin: Boolean;
}

export function generateToken(userData: UserData) {
  return sign(userData, process.env.ACCESS_TOKEN_SECRET);
}

export async function verifyToken(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  let authHeader = req.headers["authorization"];

  let token = authHeader && authHeader.split(" ")[1];
  if (token) {
    verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (_err: unknown, data: UserData) => {
        let users = await UserModel.find({_id: data.id});
        if (users.length > 0) {
          req.user = users[0];
          next();
        } else {
          res.status(400).json(createErrorJson("User does not exist"));
        }
      }
    );
  } else {
    res.status(401).json(createErrorJson("Invalid authorization token"));
  }
}

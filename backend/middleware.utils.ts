import {NextFunction, Response} from "express";
import {RequestWithUser} from "./jwt.utils";

export async function selfOrAdmin(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (req.params.id === req.user.id.toString() || req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({message: "Forbidden'"});
  }
}

export async function isAdmin(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({message: "Forbidden'"});
  }
}

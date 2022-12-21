import {NextFunction, Request, Response} from "express";
import {Sub, SubModel} from "./subs/subs.Model";
import {User} from "./users/users.Model";
import {createErrorJson} from "./utils";

export interface RequestWithUser extends Request {
  user: User;
}

export interface RequestWithSub extends Request {
  sub: Sub;
}

export interface RequestWithUserSub extends RequestWithUser {
  sub: Sub;
}

export async function selfOrAdmin(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  if (req.params.id === req.user.id.toString() || req.user.isAdmin) {
    next();
  } else {
    res.status(403).json(createErrorJson("Forbidden"));
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
    res.status(403).json(createErrorJson("Forbidden"));
  }
}

export async function getSubFromParamId(
  req: RequestWithSub,
  _res: Response,
  next: NextFunction
) {
  try {
    let sub = await SubModel.findById(req.params.id);
    req.sub = sub;
    next();
  } catch (err) {
    next(err);
  }
}

export async function isSubOwner(
  req: RequestWithUserSub,
  res: Response,
  next: NextFunction
) {
  if (req.sub.owner.toString() === req.user.id.toString()) {
    next();
  } else {
    res.status(401).json(createErrorJson("Unauthorized"));
  }
}

export async function isSubOwnerOrMod(
  req: RequestWithUserSub,
  res: Response,
  next: NextFunction
) {
  if (req.sub.owner.toString() === req.user.id.toString()) {
    next();
  } else {
    for (let mod of req.sub.mods) {
      if (mod.toString() === req.user.id.toString()) {
        next();
        return;
      }
    }

    res.status(401).json(createErrorJson("Unauthorized"));
  }
}

export async function isSubMember(
  req: RequestWithUserSub,
  res: Response,
  next: NextFunction
) {
  for (let member of req.sub.members) {
    if (member.toString() === req.user.id.toString()) {
      next();
      return;
    }
  }

  next(createErrorJson("401 Unauthorized"));
}

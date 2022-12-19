import {NextFunction, Request, Response} from "express";
import {RequestWithUser} from "../jwt.utils";
import {createErrorJson} from "../utils";
import {SubModel} from "./subs.Model";

// Get all products

var ObjectId = require("mongoose").Types.ObjectId;

// // Set user to the new owner
// .put("/sub/:id/owner", () => {})
// // Mod the user on this sub
// .put("/sub/:id/mod", () => {})
// // Join the sub
// .put("/sub/:id/join", () => {});

// Get all subs
export const getAllSubs = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subs = await SubModel.find({});
    res.status(200).json(subs);
  } catch (err) {
    res.status(404).json(createErrorJson("No subs found"));
    next(err);
  }
};

// Get sub by id
export const getSubById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sub = await SubModel.findById(req.params.id);
    res.status(200).json(sub);
  } catch (err) {
    res.status(404).json(createErrorJson("Sub with ID was not found"));
    next(err);
  }
};

export const createNewSub = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    let name = req.body.name;
    let title = req.body.title;
    let owner = req.user.id;

    const newSub = new SubModel({name, title, owner});
    await newSub.save();
    console.log(newSub);
    res.status(200).json(newSub);
  } catch (err) {
    next(err);
  }
};

export const editSub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Check req.body
    const editSub = await SubModel.findByIdAndUpdate(req.params.id, {});
    res.status(200).json(editSub);
  } catch (err) {
    res.status(404).json(createErrorJson("ID was not found"));
    next(err);
  }
};

export const deleteSub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleteSub = await SubModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deleteSub);
  } catch (err) {
    res.status(404).json(createErrorJson("ID was not found"));
    next(err);
  }
};

export const setSubOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const addSubMod = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const removeSubMod = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const joinSub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const leaveSub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

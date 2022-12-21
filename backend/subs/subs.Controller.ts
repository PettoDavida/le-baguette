import {NextFunction, Request, Response} from "express";
import {RequestWithUser, RequestWithUserSub} from "../middleware.utils";
import {createErrorJson} from "../utils";
import {SubModel} from "./subs.Model";

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
  req: RequestWithUserSub,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Check req.body.newOwner for null
    // TODO: Check if the newOwner is a member of the sub
    await SubModel.findByIdAndUpdate(req.sub._id, {
      owner: req.body.newOwner,
    });
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
};

export const addSubMod = async (
  req: RequestWithUserSub,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Check req.body.newMod for null
    // TODO: Check if the user is already a member
    await SubModel.updateOne(
      {_id: req.sub._id},
      {$push: {mods: req.body.newMod}}
    );
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};

export const removeSubMod = async (
  req: RequestWithUserSub,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Check req.body.newMod for null
    // TODO: Check if the user is a member
    await SubModel.updateOne(
      {_id: req.sub._id},
      {$pull: {mods: req.body.newMod}}
    );
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};

export const joinSub = async (
  req: RequestWithUserSub,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Check if the user is already a member
    await SubModel.updateOne(
      {_id: req.sub._id},
      {$push: {members: req.user.id}}
    );
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};

export const leaveSub = async (
  req: RequestWithUserSub,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Check if the user is a member
    await SubModel.updateOne(
      {_id: req.sub._id},
      {$pull: {members: req.user.id}}
    );
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};

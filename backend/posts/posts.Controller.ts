import {NextFunction, Request, Response} from "express";
import {createErrorJson} from "../utils";
import {PostModel} from "./posts.Model";

// Get all posts

var ObjectId = require("mongoose").Types.ObjectId;

export const getAllPostsBySub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allPosts = await PostModel.find({subID: req.params.id});
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(404).json(createErrorJson("No posts were found"));
    next(err);
  }
};

// Get a single post

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const singlePost = await PostModel.findById(req.params.id);
    res.status(200).json(singlePost);
  } catch (err) {
    res.status(404).json(createErrorJson("ID was not found"));
    next(err);
  }
};

// Get posts from a category
export const getPostsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postByCategory = await PostModel.find({
      category: ObjectId(req.params.id),
    });
    res.status(200).json(postByCategory);
  } catch (err) {
    res.status(404).json(createErrorJson("Category was not found"));
    next(err);
  }
};

// Add a post

export const addPostToSub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPost = new PostModel(req.body);
    await newPost.save();
    console.log(newPost);
    res.status(200).json(newPost);
  } catch (err) {
    res
      .status(400)
      .json(createErrorJson("Not very nice request. I need more stuff"));
    next(err);
  }
};

// Edit a post

export const editPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const editPost = await PostModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(editPost);
  } catch (err) {
    res.status(404).json(createErrorJson("ID was not found"));
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletePost = await PostModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deletePost);
  } catch (err) {
    res.status(404).json(createErrorJson("ID was not found"));
    next(err);
  }
};

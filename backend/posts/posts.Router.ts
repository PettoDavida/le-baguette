import express from "express";
import {verifyToken} from "../jwt.utils";
import {selfOrAdmin} from "../middleware.utils";

import {
  editPost,
  getAllPostsBySub,
  getPost,
  deletePost,
  addPostToSub,
} from "./posts.Controller";

export default express
  .Router()
  .get("/posts/sub/:id", getAllPostsBySub)
  .post("/posts/sub/:id", verifyToken, addPostToSub)
  .get("/posts/:id", getPost)
  .put("/posts/:id", verifyToken, editPost)
  // TODO: Check for mods on the sub
  .delete("/posts/:id", verifyToken, selfOrAdmin, deletePost);

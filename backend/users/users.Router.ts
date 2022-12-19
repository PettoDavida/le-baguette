import express from "express";
import {
  getAllUsers,
  updateUserPassword,
  addUser,
  loginUser,
  deleteUser,
  updateUserEmail,
  getUserByID,
  makeUserAdmin,
} from "./users.Controller";
import {verifyToken} from "../jwt.utils";
import {isAdmin, selfOrAdmin} from "../middleware.utils";
export default express
  .Router()
  .get("/user", verifyToken, isAdmin, getAllUsers)
  .get("/user/:id", verifyToken, selfOrAdmin, getUserByID)
  .post("/user", addUser)
  .post("/user/login", loginUser)
  .put("/user/password/:id", verifyToken, selfOrAdmin, updateUserPassword)
  .put("/user/email/:id", verifyToken, updateUserEmail)
  .put("/user/admin/:id", verifyToken, isAdmin, makeUserAdmin)
  .delete("/user/:id", verifyToken, selfOrAdmin, deleteUser);

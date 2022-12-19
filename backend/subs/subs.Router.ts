import express from "express";
import {verifyToken} from "../jwt.utils";
import {
  addSubMod,
  createNewSub,
  deleteSub,
  editSub,
  getAllSubs,
  getSubById,
  joinSub,
  leaveSub,
  removeSubMod,
  setSubOwner,
} from "./subs.Controller";

export default express
  .Router()
  // Get all subs
  .get("/sub", getAllSubs)
  // Get sub by id
  .get("/sub/:id", getSubById)
  // Create new sub
  .post("/sub", verifyToken, createNewSub)
  // Create new sub
  .put("/sub", editSub)
  // Delete the sub (only owner is allowed)
  .delete("/sub/:id", deleteSub)
  // Set user to the new owner
  .put("/sub/:id/owner", setSubOwner)
  // Mod the user on this sub
  .put("/sub/:id/mod", addSubMod)
  // Mod the user on this sub
  .delete("/sub/:id/mod", removeSubMod)
  // Join the sub
  .put("/sub/:id/join", joinSub)
  // Leave the sub
  .put("/sub/:id/leave", leaveSub);

import express from "express";
import {verifyToken} from "../jwt.utils";
import {
  getSubFromParamId,
  isSubMember,
  isSubOwner,
  isSubOwnerOrMod,
} from "../middleware.utils";
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
  // Edit sub
  .put("/sub/:id", verifyToken, getSubFromParamId, isSubOwnerOrMod, editSub)
  // Delete the sub (only owner is allowed)
  .delete("/sub/:id", verifyToken, getSubFromParamId, isSubOwner, deleteSub)
  // Set user to the new owner
  .put(
    "/sub/:id/owner",
    verifyToken,
    getSubFromParamId,
    isSubOwner,
    setSubOwner
  )
  // Mod the user on this sub
  .put("/sub/:id/mod", verifyToken, getSubFromParamId, isSubOwner, addSubMod)
  // Mod the user on this sub
  .delete(
    "/sub/:id/mod",
    verifyToken,
    getSubFromParamId,
    isSubOwner,
    removeSubMod
  )
  // Join the sub
  .put("/sub/:id/join", verifyToken, isSubMember, joinSub)
  // Leave the sub
  .put("/sub/:id/leave", verifyToken, isSubMember, leaveSub);

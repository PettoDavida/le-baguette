import {Request, Response} from "express";
import {UserModel} from "./users.Model";
import * as crypto from "crypto";
import {generateToken, RequestWithUser} from "../jwt.utils";
import {createErrorJson} from "../utils";

const getAllUsers = async (req: Request, res: Response) => {
  let users = await UserModel.find();
  res.json(users);
};

export const getUserByID = async (req: Request, res: Response) => {
  let user = await UserModel.findById(req.params.id);
  res.json(user);
};

export async function changePassword(id: string, newPassword: string) {
  let newSalt = crypto.randomBytes(16).toString("hex");
  let newHashPassword = crypto
    .pbkdf2Sync(newPassword, newSalt, 1000, 64, "sha512")
    .toString("hex");

  await UserModel.updateOne(
    {_id: id},
    {$set: {hash: newHashPassword, salt: newSalt}}
  );
}

const updateUserPassword = async (req: RequestWithUser, res: Response) => {
  if (!req.body.newPassword) {
    res.status(400).json(createErrorJson("Require 'newPassword'"));
    return;
  }

  const updatePassword = async (newPassword: string) => {
    changePassword(req.params.id, newPassword);
    res.sendStatus(200);
  };

  if (req.user.id.toString() === req.params.id) {
    // Update self password

    if (!req.body.oldPassword) {
      res.status(400).json(createErrorJson("Require 'oldPassword'"));
      return;
    }
    let password = req.body.oldPassword;
    let salt = req.user.salt.toString();
    let hashPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    if (req.user.hash === hashPassword) {
      await updatePassword(req.body.newPassword);
    } else {
      res.sendStatus(401);
    }
  } else if (req.user.isAdmin) {
    // Bypass self check
    await updatePassword(req.body.newPassword);
  } else {
    res.status(500).json(createErrorJson("Internal Server Error"));
  }
};

const updateUserEmail = async (req: RequestWithUser, res: Response) => {
  if (!req.body.oldEmail) {
    res.status(400).json(createErrorJson("Require 'oldEmail'"));
    return;
  }

  if (!req.body.newEmail) {
    res.status(400).json(createErrorJson("Require 'newEmail'"));
    return;
  }

  let oldEmail = req.body.oldEmail;

  if (req.user.email === oldEmail) {
    let searchForAlreadyExistingEmail = await UserModel.findOne({
      email: req.body.newEmail,
    });
    if (!searchForAlreadyExistingEmail) {
      const updatedUser = await UserModel.updateOne(
        {_id: req.params.id},
        {$set: {email: req.body.newEmail}}
      );
      res.status(200).json(updatedUser);
    } else {
      res.status(403).json(createErrorJson("Email already taken"));
    }
  } else {
    res.sendStatus(401);
  }
};

const addUser = async (req: Request, res: Response) => {
  if (!req.body.password) {
    res.status(400).json(createErrorJson("Password required"));
    return;
  }

  if (!req.body.email) {
    res.status(400).json(createErrorJson("Email required"));
    return;
  }

  let email = req.body.email;
  let password = req.body.password;

  let salt = crypto.randomBytes(16).toString("hex");
  let hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  const user = new UserModel({
    email,
    hash,
    salt,
  });

  let dbEmail = await UserModel.findOne({email: req.body.email});
  if (!dbEmail) {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } else {
    res.status(403).json(createErrorJson("This email already has an account"));
  }
};

const loginUser = async (req: Request, res: Response) => {
  let user = await UserModel.findOne({email: req.body.email});
  if (user) {
    let password = req.body.password;
    let salt = user.salt.toString();
    let hashPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    if (user.hash === hashPassword) {
      let userData = {
        id: user._id,
        isAdmin: user.isAdmin,
      };

      let token = generateToken(userData);

      res.status(200).json({token});
    } else {
      res.status(403).json(createErrorJson("Email or Password incorrect"));
    }
  } else {
    res.status(403).json(createErrorJson("Email or Password incorrect"));
  }
};

const makeUserAdmin = async (req: Request, res: Response) => {
  let userId = req.params.id;
  await UserModel.findByIdAndUpdate(userId, {
    $set: {isAdmin: true},
  });

  res.status(200).json({success: true});
};

const deleteUser = async (req: RequestWithUser, res: Response) => {
  let userToDelete = await UserModel.findOne({_id: req.params.id});

  if (userToDelete) {
    await UserModel.deleteMany({_id: req.params.id});
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
};

export {
  getAllUsers,
  updateUserPassword,
  updateUserEmail,
  addUser,
  loginUser,
  makeUserAdmin,
  deleteUser,
};

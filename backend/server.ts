import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import mediaRouter from "./media/media.Router";
import commentRouter from "./comments/comments.Router";
import postRouter from "./posts/posts.Router";
import subRouter from "./subs/subs.Router";
import userRouter from "./users/users.Router";
import voteRouter from "./votes/votes.Router";

dotenv.config({path: __dirname + "/.env"});

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

function err(message: string) {
  throw new Error(message);
}

const MONGO_URI =
  process.env.MONGO_CONNECT ||
  err("No 'MONGO_CONNECT' in enviroment variables");

mongoose.connect(`${MONGO_URI}`, {dbName: "Le-Baguette"});
const db = mongoose.connection;

db.on("error", (err) => {
  console.log("Mongoose Error");
  console.log(err);
});

db.once("open", () => console.log("Connected to database"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", userRouter);
app.use("/api", voteRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);
app.use("/api", subRouter);
app.use("/api", mediaRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

import createError from "http-errors";
import express, { Application, Request, Response, NextFunction } from "express";
import logger from "morgan";
import mongoose from "mongoose";
// Import session library from express-sessions
import session from "express-session";
//Import mongodb store libraries that connect to session
import { default as connectMongoDBSession } from "connect-mongodb-session";
import cors from "cors";
// Creating passport connection

import passport from "passport";
import dotenv from "dotenv";

const MongoDBStore = connectMongoDBSession(session);

dotenv.config();
const dbString: any = process.env.DB_STRING;
const sessionStore = new MongoDBStore({
  uri: dbString as string,
  databaseName: "cloudcamp",
  collection: "sessions",
});

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbString);
}
sessionStore.on("error", function (error) {
  // Also get an error here
  console.log(error);
});

// let indexRouter = require("./src/routes/index");
let usersRouter = require("./src/routes/users");
let toolDataRouter = require("./src/routes/toolInfo");
console.log(process.env.ALLOWED_ORIGIN as string);
let app: Application = express();
// Order matters keep cors before session middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.ALLOWED_ORIGIN as string,
  })
);
app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRouter);
app.use("/tools", toolDataRouter);

app.get("/logout", function (req, res, next) {
  console.log(req.user);
  if (req.user) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.send({ msg: "loggedOut" });
    });
  } else {
    let redirect: any = process.env.ALLOWED_ORIGIN;
    res.redirect(redirect as string);
  }
});

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("404");
  }
});

// error handler
// app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};
//   let errorStatus = 0;
//   // render the error page
//   res.status(errorStatus || 500).send();
//   // res.render("error");
// });

app.listen(3000, () => {
  let currMachine: any = process.env.CURRENT_MACHINE;
  console.log("⚡️[server]: Server is running at " + (currMachine as string));
});

module.exports = app;

import createError from "http-errors";
import express, { Application, Request, Response, NextFunction } from "express";
import * as path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
// Import session library from express-sessions
import session from "express-session";
//Import mongodb store libraries that connect to session
import { default as connectMongoDBSession } from "connect-mongodb-session";

const dbString = "mongodb://localhost:27017";

const MongoDBStore = connectMongoDBSession(session);

const sessionStore = new MongoDBStore({
  uri: dbString,
  databaseName: "cloudcamp",
  collection: "sessions",
});

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");

let app: Application = express();

app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);
// view engine setup

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  let errorStatus = 0;
  // render the error page
  res.status(errorStatus || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${3000}`);
});
module.exports = app;

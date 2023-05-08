import createError from "http-errors";
import express, { Application, Request, Response, NextFunction } from "express";
import * as path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");

var app: Application = express();

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

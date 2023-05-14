import { Request, Response, NextFunction, Router } from "express";
import isAuth from "../middlewares/authMiddleware";
import passport from "passport";
// Extending Session Type definition to include our required session data
// import express from "express";
// import User from "./User";

// declare module "express-session" {
//   interface SessionData {
//     user: User;
//   }
// }

let router = Router();

router.get("/", (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});
router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
  Enter Username:<br><input type="text" name="uname">\
  <br>Enter Password:<br><input type="password" name="pw">\
  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// When you visit http://localhost:3000/register, you will see "Register Page"

router.get("/protected-route", isAuth, (req, res, next) => {
  res.send("You made it to the route.");
});

router.post(
  "/login",
  passport.authenticate(["google-stat", "github-strat"], {
    failureRedirect: "/login-failure",
    successRedirect: "login-success",
  })
);

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

/* GET home page. */

module.exports = router;

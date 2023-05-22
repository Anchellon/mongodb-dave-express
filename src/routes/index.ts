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

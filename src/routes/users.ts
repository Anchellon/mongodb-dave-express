const GoogleStrategy = require("passport-google-oauth20").Strategy;
import passport = require("passport");
import dotenv = require("dotenv");

import User from "../models/User";
import { Request, Response, NextFunction, Router } from "express";
const GitHubStrategy = require("passport-github2");

let router = Router();

dotenv.config();
const googleCientID: string | undefined = process.env.GOOGLE_CLIENTID;
const googleCientSecret: string | undefined = process.env.GOOGLE_SECRET;
const ghCientID: string | undefined = process.env.GH_CLIENTID;
const ghCientSecret: string | undefined = process.env.GH_SECRET;
passport.serializeUser((user: any, done: any) => {
  // console.log(user._id);
  done(null, user._id);
});
passport.deserializeUser((id: any, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleCientID,
      clientSecret: googleCientSecret,
      callbackURL: "/users/auth/google/callback",
    },
    // Save the user here
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
      User.findOne({ id: profile.id, provider: "google" }).then((currUser) => {
        if (currUser) {
          // console.log("current user ", currUser);
          done(null, currUser);
        } else {
          new User({
            username: "",
            hash: "",
            salt: "",
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePic: profile.photos[0].value,
            id: profile.id,
            provider: "google",
            isAdmin: false,
            role: "user",
          })
            .save()
            .then((newUser) => {
              console.log("New user created" + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: ghCientID,
      clientSecret: ghCientSecret,
      callbackURL:
        (process.env.CURRENT_MACHINE as string) + "/users/auth/github/callback",
    },
    // Called on successful login , use logic here like insert into db
    function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      console.log(profile);
      User.findOne({ id: profile.id, provider: "github" }).then((currUser) => {
        if (currUser) {
          console.log("current user ", currUser);
          done(null, currUser);
        } else {
          new User({
            username: profile.username,
            hash: "",
            salt: "",
            firstName: "",
            lastName: "",
            profilePic: profile.photos[0].value,
            id: profile.id,
            provider: "github",
            isAdmin: false,
            role: "user",
          })
            .save()
            .then((newUser) => {
              console.log("New user created" + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);

/* GET users listing. */
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
    prompt: "select_account",
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  function (req, res) {
    // Successful authentication, redirect home.
    // console.log(req.user);
    let allowedOrigin: any = process.env.ALLOWED_ORIGIN;
    res.redirect(allowedOrigin as string);
  }
);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github"),
  function (req, res) {
    // Successful authentication, redirect home.
    // console.log(req.user);
    let allowedOrigin: any = process.env.ALLOWED_ORIGIN;
    res.redirect(allowedOrigin as string);
  }
);
router.get("/getInfo", (req: Request, res: Response, next: NextFunction) => {
  // res.json(req.user);
  console.log(req.user);
  res.status(200).json(req.user);
});

module.exports = router;

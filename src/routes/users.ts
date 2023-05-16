const GoogleStrategy = require("passport-google-oauth20").Strategy;
import passport = require("passport");
import dotenv = require("dotenv");

import User from "../models/User";
import { Request, Response, NextFunction, Router } from "express";
import OAuth2Strategy = require("passport-oauth2");

let router = Router();

dotenv.config();
const googleCientID: any = process.env.GOOGLE_CLIENTID;
const googleCientSecret: any = process.env.GOOGLE_SECRET;
const ghCientID: any = process.env.GH_CLIENTID;
const ghCientSecret: any = process.env.GH_SECRET;
passport.serializeUser((user: any, done: any) => {
  console.log(user._id);
  done(null, user._id);
});
passport.deserializeUser((id: any, done) => {
  console.log(id);
  console.log("throw up");
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleCientID,
      clientSecret: googleCientSecret,
      callbackURL: "http://localhost:3000/users/auth/google/callback",
    },
    // Save the user here
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
      User.findOne({ id: profile.id, provider: "google" }).then((currUser) => {
        if (currUser) {
          console.log("current user ", currUser);
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
  "github-strat",
  new OAuth2Strategy(
    {
      authorizationURL: "https://github.com/login/oauth/authorize",
      tokenURL: "https://github.com/login/oauth/access_token",
      clientID: ghCientID,
      clientSecret: ghCientSecret,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    // Called on successful login , use logic here like insert into db
    function (accessToken: any, refreshToken: any, profile: any, cb: any) {
      console.log(profile);
      cb(null, profile);
    }
    // default example call back
    // function (accessToken: , refreshToken, profile, cb) {
    //   User.findOrCreate({ exampleId: profile.id }, function (err, user) {
    //     return cb(err, user);
    //   });
    // }
  )
);

/* GET users listing. */
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log(req.user);
    res.redirect("http://localhost:5173");
  }
);

router.get(
  "/auth/github",
  passport.authenticate("ouath2", { scope: ["profile"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github-strat ", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:5173");
  }
);
module.exports = router;

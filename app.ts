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
let GoogleStrategy = require("passport-google-oauth20").Strategy;
// Creating passport connection

import passport from "passport";
import dotenv from "dotenv";
import Strategy from "passport-oauth2";

dotenv.config();
const dbString: any = process.env.DB_STRING;
const googleCientID: any = process.env.GOOGLE_CLIENTID;
const googleCientSecret: any = process.env.GOOGLE_SECRET;
const ghCientID: any = process.env.GH_CLIENTID;
const ghCientSecret: any = process.env.GH_SECRET;
const MongoDBStore = connectMongoDBSession(session);

const sessionStore = new MongoDBStore({
  uri: dbString,
  databaseName: "cloudcamp",
  collection: "sessions",
});
sessionStore.on("error", function (error) {
  // Also get an error here
  console.log(error);
});

let indexRouter = require("./src/routes/index");
let usersRouter = require("./src/routes/users");

let app: Application = express();

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

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

app.use(passport.initialize());
app.use(passport.session());
// add strategy below session
passport.serializeUser((user, done) => {
  return done(null, user);
});
passport.deserializeUser((user: any, done) => {
  return done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: googleCientID,
      clientSecret: googleCientSecret,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken: any, refreshToken: any, profile: any, cb: any) {
      console.log(profile);
      cb(null, profile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log("Im here");
    res.redirect("http://localhost:5173");
  }
);

//  Next strategy
// passport.use(
//   "github-strat",
//   new OAuth2Strategy(
//     {
//       authorizationURL: "https://github.com/login/oauth/authorize",
//       tokenURL: "https://github.com/login/oauth/access_token",
//       clientID: ghCientID,
//       clientSecret: ghCientSecret,
//       callbackURL: "http://localhost:3000/auth/github/callback",
//     },
//     // Called on successful login , use logic here like insert into db
//     function (accessToken: any, refreshToken: any, profile: any, cb: any) {
//       console.log(profile);
//       cb(null, profile);
//     }
//     // default example call back
//     // function (accessToken: , refreshToken, profile, cb) {
//     //   User.findOrCreate({ exampleId: profile.id }, function (err, user) {
//     //     return cb(err, user);
//     //   });
//     // }
//   )
// );
// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

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
  console.log(`⚡️[server]: Server is running at http://localhost:${3000}`);
});

// app.get(
//   "/auth/github/callback",
//   passport.authenticate("github-strat ", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("http://localhost:5173");
//   }
// );
module.exports = app;

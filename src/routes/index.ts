import { Request, Response, NextFunction, Router } from "express";
// Extending Session Type definition to include our required session data
// import express from "express";
// import User from "./User";

// declare module "express-session" {
//   interface SessionData {
//     user: User;
//   }
// }

let router = Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  if (req.session.viewCount) {
    req.session.viewCount = req.session.viewCount + 1;
  } else {
    req.session.viewCount = 1;
  }
  res.send(
    `<h1>This is the number of times you have viewd the page ${req.session.viewCount}</h1>`
  );
});

module.exports = router;

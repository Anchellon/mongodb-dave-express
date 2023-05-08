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
  res.render("index", { title: "Express" });
});

module.exports = router;

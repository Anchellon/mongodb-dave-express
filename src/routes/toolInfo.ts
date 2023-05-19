import { Request, Response, NextFunction, Router } from "express";
import isAuth from "../middlewares/authMiddleware";
import passport from "passport";

let router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  res.status(200).send();
});

module.exports = router;

import { Request, Response, NextFunction, Router } from "express";

let router = Router();

/* GET users listing. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.send("respond with a resource");
});

module.exports = router;

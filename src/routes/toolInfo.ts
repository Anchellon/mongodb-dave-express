import { Request, Response, NextFunction, Router } from "express";
import isAuth from "../middlewares/authMiddleware";
import passport from "passport";

let router = Router();
const tool_controller = require("../controllers/toolController");
router.post("/", isAuth, tool_controller.tool_createTool);

router.get("/", tool_controller.getTools);

module.exports = router;

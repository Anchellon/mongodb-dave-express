import Tool from "../models/Tool";
import { Response, Request } from "express";
import { ITool } from "../Interfaces/ToolInterface";

exports.tool_createTool = (req: Request<ITool>, res: Response) => {
  const tool = new Tool({
    name: req.body.name,
    url: req.body.url,
    category: req.body.category,
    desc: req.body.desc,
    active: false,
  });
  console.log(tool);
  tool.save().then(() => {
    res.status(200).send(tool);
  });
};

exports.getTools = (req: Request, res: Response) => {
  let resObj: any = {};

  Tool.find({ active: true }).then((toolArray) => {
    resObj.tools = toolArray;
    resObj.message = "Tool List for the user";
    res.status(200).send(resObj);
  });
};

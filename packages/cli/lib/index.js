import { program } from "commander";
import createCLI from "./createCLI.js";
import createInitCommand from "@coderyjw/init";

export default function (args) {
  createCLI(program);

  createInitCommand(program)
  
  // 解析配置
  program.parse(process.argv);
}

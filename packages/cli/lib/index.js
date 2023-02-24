import { program } from "commander";
import createCLI from "./createCLI.js";

export default function (args) {
  createCLI(program);

  // 解析配置
  program.parse(process.argv);
}

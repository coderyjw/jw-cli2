import { program } from "commander";
import createCLI from "./createCLI.js";
import createInitCommand from "@coderyjw/init";
import createInstall from "@coderyjw/install";
import createLint from "@coderyjw/lint";
import "./exception.js";

export default function (args) {
  createCLI(program);

  createInitCommand(program);

  createInstall(program);

  createLint(program);

  // 解析配置
  program.parse(process.argv);
}

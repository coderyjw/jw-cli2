import fse from "fs-extra";
import path from "path";
import { dirname } from "dirname-filename-esm";
import { log } from "@coderyjw/utils";
import semver from "semver";
import chalk from "chalk";

const __dirname = dirname(import.meta);
const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = fse.readJsonSync(pkgPath);
const LOWEST_NODE_VERSION = "14.0.0";

const checkNodeVersion = () => {
  log.verbose("node version", process.version);
  // 当前 node 版本低于 LOWEST_NODE_VERSION 时 抛出错误
  if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
    throw new Error(
      chalk.red(`jw-cli 需要安装 ${LOWEST_NODE_VERSION} 以上版本的 Node.js`)
    );
  }
};

const preAction = () => {
  // 检查 Node 版本
  checkNodeVersion();
};
export default function createCLI(program) {
  // 命令注册
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("<command> [options]")
    .version(pkg.version, "-v, --version", "输出当前版本号")
    .option("-d, --debug", "是否开启调试模式", false)
    .helpOption("-h, --help", "命令显示帮助")
    .addHelpCommand("help [command]", "命令显示帮助")
    .hook("preAction", preAction);

  // 监听未知的命令
  program.on("command:*", function (obj) {
    log.error("未知的命令：" + obj[0]);
  });

  // 监听 debug 选项
  program.on("option:debug", function () {
    if (program.opts().debug) {
      log.verbose("debug", "开启调试模式");
    }
  });
}

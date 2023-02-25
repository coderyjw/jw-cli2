import { homedir } from "os";
import path from "path";
import { execa } from "execa";
import { pathExistsSync } from "path-exists";
import fse from "fs-extra";
import { makePassword } from "../lib/inquirer.js";
import { log } from "../lib/index.js";

const TEMP_HOME = ".jw-cli";
const TEMP_GITHUB_TOEN = ".github-token";
const TEMP_GITEE_TOEN = ".gitee-token";

function createTokenPath(platForm) {
  if (platForm === "github") {
    return path.resolve(homedir(), TEMP_HOME, TEMP_GITHUB_TOEN);
  } else {
    return path.resolve(homedir(), TEMP_HOME, TEMP_GITEE_TOEN);
  }
}

export default class GitServer {
  constructor() {}

  async init(platForm) {
    // 判断 token 是否录入
    const tokenPath = createTokenPath(platForm);
    if (pathExistsSync(tokenPath)) {
      this.token = fse.readFileSync(tokenPath).toString();
    } else {
      this.token = await this.getToken();
      fse.writeFileSync(tokenPath, this.token);
    }
    log.verbose("token", this.token);
  }

  async getToken() {
    return await makePassword({ message: "请输入 token 信息" });
  }

  cloneRepo(fullName, tag) {
    if (tag) {
      return execa("git", ["clone", this.getRepoUrl(fullName), "-b", tag]);
    }
    return execa("git", ["clone", this.getRepoUrl(fullName)]);
  }
}

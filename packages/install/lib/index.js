import Command from "@coderyjw/command";
import { chooseGitPlatForm, initGitServer } from "@coderyjw/utils";

class InstallCommand extends Command {
  get command() {
    return "install";
  }

  get description() {
    return "项目下载、安装依赖、启动项目";
  }

  get options() {
    return [["-c, --clear", "清空缓存", false]];
  }

  async action() {
    await this.generateGitAPI();
  }

  async generateGitAPI() {
    this.platForm = await chooseGitPlatForm();

    this.gitAPI = await initGitServer(this.platForm);
  }
}

function Install(instance) {
  return new InstallCommand(instance);
}

export default Install;

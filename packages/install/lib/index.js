import Command from "@coderyjw/command";


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

  async action() {}
}

function Install(instance) {
  return new InstallCommand(instance);
}

export default Install;

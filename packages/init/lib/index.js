import Command from "@coderyjw/command";
import { log } from "@coderyjw/utils";

class InitCommand extends Command {
  get command() {
    return "init [name]";
  }

  get description() {
    return "项目初始化";
  }

  get options() {
    return [
      ["-f, --force", "是否强制更新", false],
      ["-t, --type <type>", "项目类型(project/page)"],
      ["-tp, --template <template>", "模版名称"],
    ];
  }

  async action([name, opts]) {
    log.verbose("init", `我要创建的模板名称为${name}，传入了这些参数`, opts);
  }

  preAction() {}

  postAction() {}
}

function Init(instance) {
  return new InitCommand(instance);
}

export default Init;

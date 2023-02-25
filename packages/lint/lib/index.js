import Command from "@coderyjw/command";

class LintCommand extends Command {
  get command() {
    return "lint [name]";
  }

  get description() {
    return "代码规范自动化检查、自动化测试";
  }

  get options() {
    return [];
  }

  async action([name, opts]) {}

  preAction() {}

  postAction() {}
}

function Lint(instance) {
  return new LintCommand(instance);
}

export default Lint;

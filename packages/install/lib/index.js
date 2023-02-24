import Command from "@coderyjw/command";
import {
  chooseGitPlatForm,
  initGitServer,
  makeList,
  makeInput,
  log,
} from "@coderyjw/utils";

const PREV_PAGE = "prev_page";
const NEXT_PAGE = "next_page";
const SEARCH_MODE_REPO = "search_mode_repo";
const SEARCH_MODE_CODE = "search_mode_code";
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

    await this.searchGitAPI();
    log.verbose("selectedProject", this.selectedProject);
  }

  async generateGitAPI() {
    this.platForm = await chooseGitPlatForm();

    this.gitAPI = await initGitServer(this.platForm);
  }

  async searchGitAPI() {
    log.verbose("this.platForm", this.platForm);
    if (this.platForm === "github") {
      this.mode = await makeList({
        message: "请选择搜索模式",
        choices: [
          { name: "仓库名称", value: SEARCH_MODE_REPO },
          { name: "源码", value: SEARCH_MODE_CODE },
        ],
      });
    }

    // 1. 收集搜索关键词和开发语言
    this.q = await makeInput({
      message: "请输入搜索关键词",
      validate(value) {
        if (value) {
          return true;
        } else {
          return "请输入搜索关键词";
        }
      },
    });

    this.language = await makeInput({
      message: "请输入开发语言",
    });

    this.keywords =
      this.q + (this.language ? `+language:${this.language}` : "");

    log.verbose("search keywords", this.keywords, this.platForm);

    this.page = 1;
    this.perPage = 10;

    await this.doSearch();
  }

  async doSearch() {
    // 2. 根据平台生成搜索参数
    let params;
    let count = 0;
    let list;
    let searchResult;

    if (this.platForm === "github") {
      params = {
        q: this.keywords,
        order: "desc",
        per_page: this.perPage,
        page: this.page,
      };

      log.verbose("search project params", params);
      log.verbose("mode", this.mode);
      if (this.mode === SEARCH_MODE_REPO) {
        searchResult = await this.gitAPI.searchRepositories(params);
        list = searchResult.items.map((item) => ({
          name: `${item.full_name}（${item.description}）`,
          value: item.full_name,
        }));
      } else if (this.mode === SEARCH_MODE_CODE) {
        searchResult = await this.gitAPI.searchCode(params);
        list = searchResult.map((item) => ({
          name:
            item.repository.full_name +
            (item.repository.description &&
              `（${item.repository.description}）`),
          value: item.repository.full_name,
        }));
      }

      count = searchResult.total_count; // 整体数据量
    } else if (this.platForm === "gitee") {
      params = {
        q: this.q,
        order: "desc",
        per_page: this.perPage,
        page: this.page,
      };
      if (this.language) {
        params.language = this.language; // 注意输入格式: JavaScript
      }
      log.verbose("search params", params);
      searchResult = await this.gitAPI.searchRepositories(params);

      count = 99999;

      list = searchResult.map((item) => ({
        name: `${item.full_name}（${item.description}）`,
        value: item.full_name,
      }));
    }
    // 判断当前页面，已经是否达到最大页数
    if (
      (this.platForm === "github" && this.page * this.perPage < count) ||
      (this.platForm === "gitee" && list?.length > 0)
    ) {
      list.push({
        name: "下一页",
        value: NEXT_PAGE,
      });
    }

    if (this.page > 1) {
      list.unshift({
        name: "上一页",
        value: PREV_PAGE,
      });
    }

    if (count > 0) {
      const selectedProject = await makeList({
        message:
          this.platForm === "github"
            ? `请选择要下载的项目（共 ${count} 条数据）`
            : "请选择要下载的项目",
        choices: list,
      });

      if (selectedProject === NEXT_PAGE) {
        await this.nextPage();
      } else if (selectedProject === PREV_PAGE) {
        await this.prevPage();
      } else {
        // 选中项目 去查询 tag
        this.selectedProject = selectedProject;
      }
    }
  }

  async nextPage() {
    this.page++;
    await this.doSearch();
  }

  async prevPage() {
    this.page--;
    await this.doSearch();
  }
}

function Install(instance) {
  return new InstallCommand(instance);
}

export default Install;

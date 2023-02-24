import GitServer from "./GitServer.js";
import { log } from "../lib/index.js";

const BASE_URL = "https://gitee.com/api/v5";

export default class Gitee extends GitServer {
  constructor() {
    super();
  }
}

import  GitServer  from "./GitServer.js";
import { log } from "../lib/index.js";

const BASE_URL = "https://api.github.com";

export default class GitHub extends GitServer {
  constructor() {
    super();
  }
}

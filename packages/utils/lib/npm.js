import urlJoin from "url-join";
import axios from "axios";
import log from "./log.js";

function getNpmInfo(npmName) {
  // npm API 地址 https://registry.npmjs.org/
  // 如果 npm 过慢,可以使用淘宝镜像 https://registry.npmmirror.com/
  const registry = "https://registry.npmmirror.com/";
  const url = urlJoin(registry, npmName);
  return axios.get(url).then((res) => {
    try {
      return res.data;
    } catch (e) {
      Promise.reject(e);
    }
  });
}

export default async function getLatestVersion(npmNmae) {
  const result = await getNpmInfo(npmNmae);
  if (result?.["dist-tags"]?.["latest"]) {
    return result["dist-tags"]["latest"];
  }
  log.error("没有 latest 版本号");
  return Promise.reject("没有 latest 版本号");
}

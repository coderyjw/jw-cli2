import log from "npmlog";
import isDebug from "./isDebug.js";

if (isDebug()) {
  log.level = "verbose";
} else {
  log.level = "info";
}

log.heading = "jw-cli";

log.addLevel("success", 2000, { fg: "green", bold: true });

export function printErrorLog(e, type) {
  if (isDebug()) {
    log.error(type, e);
  } else {
    log.error(type, e.message);
  }
}

export default log;

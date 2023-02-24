/**
 * 判断是否是 debug 模式
 * @returns boolean
 */
export default function isDebug() {
  return process.argv.includes("--debug") || process.argv.includes("-d");
}

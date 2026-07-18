import { execFileSync } from "node:child_process";

const now = new Date();
const stamp = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
  "-",
  String(now.getHours()).padStart(2, "0"),
  String(now.getMinutes()).padStart(2, "0"),
  String(now.getSeconds()).padStart(2, "0")
].join("");
const tagName = `backup-${stamp}`;

execFileSync("git", ["tag", tagName], { stdio: "inherit" });
console.log(`Created backup tag: ${tagName}`);

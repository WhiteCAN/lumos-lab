import hljs from "highlight.js/lib/core";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import yaml from "highlight.js/lib/languages/yaml";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import http from "highlight.js/lib/languages/http";

const highlighter = hljs.newInstance();
const languages = { java, javascript, typescript, python, json, sql, bash, yaml, xml, css, dockerfile, http };
for (const [name, grammar] of Object.entries(languages)) highlighter.registerLanguage(name, grammar);
export type CodeLanguage = keyof typeof languages | "plaintext";

export function highlightCode(code: string, language?: CodeLanguage): string {
  // highlight.js escapes source text before emitting its own token spans; never render raw source as HTML.
  if (language === "plaintext") return code.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  return language ? highlighter.highlight(code, { language, ignoreIllegals: true }).value : highlighter.highlightAuto(code).value;
}

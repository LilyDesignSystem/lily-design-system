import { fileURLToPath } from "node:url";
import path from "node:path";
import nunjucks from "nunjucks";
import { JSDOM } from "jsdom";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const env = nunjucks.configure(projectRoot, {
  autoescape: true,
  throwOnUndefined: false,
  trimBlocks: true,
  lstripBlocks: true,
});

export function toMacroName(kebab) {
  return kebab.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

export function render(componentName, params = {}, callerContent = null) {
  const macro = toMacroName(componentName);
  const importPath = `components/${componentName}/macro.njk`;
  const src = callerContent === null
    ? `{% from "${importPath}" import ${macro} %}`
      + `{{ ${macro}(params) }}`
    : `{% from "${importPath}" import ${macro} %}`
      + `{% call ${macro}(params) %}${callerContent}{% endcall %}`;
  const html = env.renderString(src, { params });
  // jsdom follows HTML parsing rules that drop table-part elements
  // (thead/tbody/tfoot/tr/th/td) unless they sit inside a <table>.
  // Auto-wrap so tests can query the rendered element.
  let domSource = html;
  if (/^\s*<(thead|tbody|tfoot|tr|th|td)\b/i.test(html)) {
    domSource = `<table>${html}</table>`;
  }
  const dom = new JSDOM(domSource);
  return { html, document: dom.window.document };
}

export { env };

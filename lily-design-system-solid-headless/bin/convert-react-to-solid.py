#!/usr/bin/env python3
"""Port a hook-free Lily React headless component (and its test) to Solid 2.0.

  convert.py SRC_DIR OUT_DIR [Name ...]

Writes OUT_DIR/{Name}.tsx and OUT_DIR/{Name}.test.tsx and prints, per file, "ok", "skip: <reason>" or "manual: <reason>".
The output is a starting point that is then maintained by hand; this script is a porting aid, not a generator.
"""
import re
import subprocess
import sys
from pathlib import Path

HOOKS = re.compile(r"\buse(State|Effect|Ref|LayoutEffect|Imperative\w*|FormReset|Reducer|Context)\b")
TEXTLIKE_INPUT_TYPES = {"text", "search", "email", "tel", "url", "password", "number", "date", "time", "datetime-local",
                        "month", "week", "color", "range", None}


def find_close(s, i, open_ch, close_ch):
    """Index of the bracket closing the one at s[i]; skips strings, template literals and comments."""
    depth = 0
    j = i
    while j < len(s):
        c = s[j]
        if c in "\"'`":
            q = c
            j += 1
            while j < len(s) and s[j] != q:
                if s[j] == "\\":
                    j += 1
                elif q == "`" and s[j] == "$" and j + 1 < len(s) and s[j + 1] == "{":
                    j = find_close(s, j + 1, "{", "}")
                j += 1
        elif s.startswith("//", j) and (j == 0 or s[j - 1] != ":"):
            j = s.index("\n", j) if "\n" in s[j:] else len(s)
            continue
        elif c == open_ch:
            depth += 1
        elif c == close_ch:
            depth -= 1
            if depth == 0:
                return j
        j += 1
    raise ValueError("unbalanced")


def split_top(s, sep=","):
    out, depth, cur, q = [], 0, "", None
    for c in s:
        if q:
            cur += c
            if c == q:
                q = None
            continue
        if c in "\"'`":
            q = c
        elif c in "([{":
            depth += 1
        elif c in ")]}":
            depth -= 1
        if c == sep and depth == 0:
            out.append(cur)
            cur = ""
        else:
            cur += c
    if cur.strip():
        out.append(cur)
    return [x.strip() for x in out if x.strip()]


def types(s):
    s = s.replace('import React from "react";\n', "")
    s = re.sub(r"React\.(ReactNode|ReactElement|JSX\.Element)", "JSX.Element", s)
    s = re.sub(r"React\.CSSProperties", "JSX.CSSProperties", s)
    s = re.sub(r"React\.(Mouse|Keyboard|Focus|Pointer|Drag|Clipboard|Touch|Wheel|Animation|Transition|UI)Event<(\w+)>",
               r"\1Event & { currentTarget: \2 }", s)
    s = re.sub(r"React\.(Mouse|Keyboard|Focus|Pointer|Drag|Clipboard|Touch|Wheel|Animation|Transition|UI)Event\b",
               r"\1Event", s)
    s = re.sub(r"React\.(Change|Form|Synthetic|Invalid)Event<(\w+)>", r"Event & { currentTarget: \2 }", s)
    s = re.sub(r"React\.(Change|Form|Synthetic|Invalid)Event\b", "Event", s)
    s = re.sub(r"React\.HTMLAttributes<(\w+)>", r"JSX.HTMLAttributes<\1>", s)
    s = re.sub(r"\bclassName(\??):", r"class\1:", s)
    s = re.sub(r"^(//.*)\bclassName\b", r"\1class", s, flags=re.M)
    s = s.replace("React.MouseEvent", "MouseEvent")
    return s


def hook_pass(body):
    """React hooks -> Solid 2 primitives. Returns (body, states, keep, imports, problem)."""
    states, keep, imps = [], set(), set()
    synced_set = set()
    # useState
    def st(mo):
        v, setter, gen, init = mo.group(1), mo.group(2), mo.group(3) or "", mo.group(4)
        states.append((v, setter, init))
        imps.add("createSignal")
        return f"const [{v}, {setter}] = createSignal{gen}(__INIT_{v}__);"
    body = re.sub(r"const \[(\w+), (\w+)\] = useState(<[^;]*?>)?\(([^;]*?)\);", st, body)
    # useEffect / useLayoutEffect
    out, i = "", 0
    while True:
        m = re.search(r"\buse(Layout)?Effect\(", body[i:])
        if not m:
            out += body[i:]
            break
        a = i + m.start()
        o = i + m.end() - 1
        c = find_close(body, o, "(", ")")
        args = split_top(body[o + 1:c])
        end = c + 1
        if body[end:end + 1] == ";":
            end += 1
        fn = args[0] if args else ""
        deps = args[1] if len(args) > 1 else None
        # the "sync state from prop" idiom: useEffect(() => setX(A), [A]) or with a block
        sm = re.fullmatch(r"\(\)\s*=>\s*\{?\s*(\w+)\(([^;()]+)\);?\s*\}?", fn)
        synced = None
        if sm and deps and deps.strip("[] ") == sm.group(2).strip():
            for v, setter, init in states:
                if setter == sm.group(1) and init.strip() == sm.group(2).strip():
                    synced = v
        if synced:
            synced_set.add(synced)
            out += body[i:a].rstrip(" ")
            i = end
            if body[i:i + 1] == "\n":
                i += 1
            continue
        if deps is None or deps.strip() == "[]":
            # No dependency list (React: after every render) is mount-time here; a port that must follow state is
            # rewritten by hand to a createEffect over that state.
            imps.update({"onSettled", "untrack"})
            rep = f"onSettled(() => untrack({fn}));"
        else:
            imps.update({"createEffect", "untrack"})
            rep = f"createEffect(\n        () => {deps},\n        () => untrack({fn}),\n    );"
        out += body[i:a] + rep
        i = end
    body = out
    keep.add("__synced__:" + ",".join(sorted(synced_set)))
    # useRef
    def rf(mo):
        v, gen, init = mo.group(1), mo.group(2), mo.group(3)
        keep.add(v)
        if gen:
            t = gen[1:-1]
            if init.strip() == "null":
                return f"const {v}: {{ current: {t} | null }} = {{ current: null }};"
            return f"const {v}: {{ current: {t} }} = {{ current: {init} }};"
        return f"const {v} = {{ current: {init or 'undefined'} }};"
    body = re.sub(r"const (\w+) = useRef(<[^;]*?>)?\(([^;]*?)\);", rf, body)
    body = re.sub(r"\bref=\{(\w+)\}", r"ref={(el) => (\1.current = el)}", body)
    # useId
    if "useId()" in body:
        imps.add("createUniqueId")
        body = body.replace("useId()", "createUniqueId()")
        for mo in re.finditer(r"const (\w+)(?:\s*:\s*[\w<>| ]+)?\s*=[^;]*createUniqueId\(\)", body):
            keep.add(mo.group(1))
    # form reset
    body = re.sub(r"useFormReset\((\w+),", r"useFormReset(() => \1.current,", body)
    return body, states, keep, imps, None


def convert_component(src, allow_hooks=False):
    s = src
    if allow_hooks:
        s = re.sub(r"\bReact\.(useState|useEffect|useLayoutEffect|useRef|useId)\b", r"\1", s)
        s = re.sub(r"<React\.Fragment(?:\s+key=\{[^}]*\})?>", "<>", s).replace("</React.Fragment>", "</>")
        s = re.sub(r"\bReact\.JSX\.", "JSX.", s)
        s = re.sub(r"React\.RefObject<(\w+)( \| null)?>", r"{ current: \1 | null }", s)
        s = re.sub(r"React\.Key\b", "string | number", s)
    sync_names = set()
    if HOOKS.search(s) and not allow_hooks:
        return None, "hooks"
    form_reset = 'from "./form-reset"' in s
    s = re.sub(r'import \* as React from "react";\n', "", s) if allow_hooks else s
    s = re.sub(r"\n[ \t]*// eslint-disable-next-line react-hooks/[\w-]+", "", s)
    s = re.sub(r"React\.RefObject<([^>]+)>", r"{ current: \1 }", s) if allow_hooks else s
    s = re.sub(r"\): React\.ReactElement \{", "): JSX.Element {", s) if allow_hooks else s
    s = re.sub(r'import React(, \{[^}]*\})? from "react";\n', "", s) if allow_hooks else s
    s = re.sub(r'import \{ [^}]*\} from "react";\n', "", s) if allow_hooks else s
    if re.search(r'from "react";', s.replace('import React from "react";', "")):
        return None, "react import"
    if "React." in re.sub(r"React\.(ReactNode|ReactElement|CSSProperties|\w+Event(<[^>]*>)?|HTMLAttributes<\w+>|JSX\.Element)", "", s):
        return None, "other React API: " + ", ".join(sorted(set(re.findall(r"React\.\w+", s))))
    m = re.search(r"^export default function (\w+)(<[^>(]*>)?\(\{", s, re.M)
    if not m:
        return None, "signature"
    name = m.group(1)
    o = m.end() - 1  # the "{"
    c = find_close(s, o, "{", "}")
    sig = s[o + 1:c]
    after = re.match(r"\}:\s*(\w+(?:<[^>]*>)?)\s*,?\s*\)(?:\s*:\s*(?:JSX\.Element|React\.ReactElement))?\s*\{\n", s[c:])
    if not after:
        return None, "props type"
    ptype = after.group(1)
    body_start = c + after.end()
    body_end = s.rstrip().rindex("}")
    body = s[body_start:body_end]
    states, keep, himps = [], set(), set()
    if allow_hooks:
        body, states, keep, himps, prob = hook_pass(body)
        if prob:
            return None, prob
    sync_names = set()
    for k in list(keep):
        if k.startswith("__synced__:"):
            sync_names = set(filter(None, k.split(":", 1)[1].split(",")))
            keep.discard(k)

    defaults, keys, alias, rest = [], [], {}, None
    sig = re.sub(r"//[^\n]*", "", sig)
    for part in split_top(sig):
        if part.startswith("..."):
            rest = part[3:]
            continue
        mm = re.match(r"(\w+)(?:\s*:\s*(\w+))?(?:\s*=\s*([\s\S]+))?$", part)
        if not mm:
            return None, f"param {part!r}"
        k, a, d = mm.groups()
        k2 = "class" if k == "className" else k
        keys.append(k2)
        alias[a or k] = k2
        if d is not None and d.strip() != "undefined":
            defaults.append(f"{k2}: {d.strip()}")

    # Body: bare uses of the props become p.<name>; locals computed from props become accessors.
    locals_ = []
    dynamics = []
    lines = body.split("\n")
    out_lines = []
    i = 0
    stmt_re = re.compile(r"^    const (\w+)(\s*:\s*[^=]+)?\s*=\s*([\s\S]*)$")
    # Join multi-line top-level const statements.
    joined = []
    buf = None
    for ln in lines:
        if buf is not None:
            buf += "\n" + ln
            if ln.rstrip().endswith(";") and buf.count("(") == buf.count(")") and buf.count("{") == buf.count("}") and buf.count("[") == buf.count("]"):
                joined.append(buf)
                buf = None
            continue
        if re.match(r"^    const \w+", ln) and not (ln.rstrip().endswith(";") and ln.count("(") == ln.count(")") and ln.count("{") == ln.count("}")):
            buf = ln
            continue
        joined.append(ln)
    if buf is not None:
        return None, "unterminated statement"
    for ln in joined:
        mm = stmt_re.match(ln)
        if mm and not ln.lstrip().startswith("return"):
            v, t, e = mm.groups()
            e = e.rstrip()
            if e.endswith(";"):
                e = e[:-1]
            if v in keep or re.match(r"^(async\s+)?(\w+|\([^()]*(\([^()]*\)[^()]*)*\))(\s*:\s*[^=]+?)?\s*=>", e) or e.startswith("function"):
                out_lines.append(ln)  # a function: stays a function
            elif v[0].isupper() and re.search(r"<" + v + r"\b", body):
                # a JSX tag chosen at runtime: Solid 2's dynamic(), which stays reactive to the props it reads
                dynamics.append(v)
                out_lines.append(f"    const {v} = dynamic(() => {e});")
            else:
                locals_.append(v)
                ee = e.strip()
                if ee.startswith("{"):
                    m_as = re.match(r"^(\{[\s\S]*\})(\s+as\s+[\w.<>\[\]| ]+)?$", ee)
                    ee = f"({m_as.group(1)}{m_as.group(2) or ''})" if m_as else f"({ee})"
                out_lines.append(f"    const {v} = (){(t or '').rstrip() if t else ''} => {ee};".replace("() :", "():"))
            continue
        out_lines.append(ln)
    body = "\n".join(out_lines)
    for v, setter, init in states:
        locals_.append(v)
        decl_ok = True

    def subst(text):
        # identifiers: props → p.x ; locals → x()
        def rep(mo, text):
            pre, w = mo.group(1), mo.group(2)
            after = text[mo.end():]
            if pre == "." and text[max(0, mo.start(2) - 3):mo.start(2)] == "...":
                pass  # a spread of a prop or local
            elif pre == "-" and not re.match(r"[\w-]", text[mo.start(1) - 1:mo.start(1)] or " "):
                pass  # unary minus
            elif pre in (".", "-", "<"):
                return mo.group(0)  # a member access, the tail of aria-label / data-type, or an opening tag name
            if pre == "/" and text[mo.start(1) - 1:mo.start(1)] == "<":
                return mo.group(0)  # a closing tag name
            if re.match(r"=(?![=>])", after) and pre in (" ", "\n", "\t"):
                return mo.group(0)  # a JSX attribute name
            if re.match(r"\s*:(?!:)", after) and re.search(r"[{,]\s*$", text[:mo.start(2)]):
                return mo.group(0)  # an object key
            if (w in alias or w in locals_) and re.match(r"\s*[,}]", after) and re.search(r"[{,]\s*$", text[:mo.start(2)]) \
                    and in_object_literal(text, mo.start(2)):
                val = ("p." + alias[w]) if w in alias else (w + "()")
                return pre + w + ": " + val  # object shorthand
            if w in alias:
                return pre + "p." + alias[w]
            if w in locals_:
                return pre + w + "()"
            return mo.group(0)

        names = sorted(set(alias) | set(locals_), key=len, reverse=True)
        if not names:
            return text
        pat = re.compile(r"(^|[^\w$])(" + "|".join(map(re.escape, names)) + r")\b")
        return mask_strings(text, lambda t: pat.sub(lambda mo: rep(mo, t), t))

    # don't rewrite the local declarations' own names
    decl_guard = {}
    for v in locals_:
        body = body.replace(f"    const {v} = ", f"    const __LOCAL_{v}__ = ")
    for v, setter, init in states:
        body = body.replace(f"const [{v}, {setter}]", f"const [__STATE_{v}__, {setter}]")
    if rest:
        body = re.sub(r"\b" + re.escape(rest) + r"\[", "p[", body)
    body = types(body)
    body = jsx(body)
    body = subst(body)
    for v in locals_:
        body = body.replace(f"    const __LOCAL_{v}__ = ", f"    const {v} = ")
    for v, setter, init in states:
        body = body.replace(f"const [__STATE_{v}__, {setter}]", f"const [{v}, {setter}]")
        init_s = subst(init) if init.strip() else ""
        synced = v in sync_names
        body = body.replace(f"__INIT_{v}__", f"() => {init_s}" if synced else (f"untrack(() => {init_s})" if re.search(r"\bp\.", init_s) else init_s))

    defaults_s = "{ " + ", ".join(re.sub(r'^(\w+): ("[^"]*")$', r"\1: \2 as const", d) for d in defaults) + " }" if defaults else "{}"
    omit_keys = ", ".join(f'"{k}"' for k in keys)
    head = f"    const p = withDefaults({defaults_s}, props);\n"
    if rest:
        head += f"    const {rest} = omit(p, {omit_keys});\n"
    pre = s[:m.start()]
    pre = types(pre)
    imports = ['import type { JSX } from "@solidjs/web";']
    if dynamics:
        imports = ['import { dynamic, type JSX } from "@solidjs/web";']
    solid_imp = (["omit"] if rest else []) + sorted(himps | ({"untrack"} if "untrack(" in body else set()))
    solid_imp = list(dict.fromkeys(solid_imp))
    imports.append("import { " + ", ".join(solid_imp) + ' } from "solid-js";')
    imports.append('import { withDefaults } from "./defaults";')
    if "attr(" in body:
        imports.append('import { attr } from "./attr";')
    if form_reset:
        imports.append('import { useFormReset } from "./form-reset";')
    pre = re.sub(r'(\n|^)(import [^\n]*\n)', lambda mo: mo.group(0), pre, count=0)
    # place solid imports before the first remaining import or before "export interface"
    first_imp = re.search(r"^import ", pre, re.M)
    ins = first_imp.start() if first_imp else pre.index("export ")
    pre = pre[:ins] + "\n".join(imports) + "\n" + pre[ins:]
    pre = re.sub(r"\n{3,}", "\n\n", pre)
    out = pre + f"export default function {name}{m.group(2) or ''}(props: {ptype}) {{\n" + head + body + "}\n"
    if "JSX." not in out:
        out = out.replace('import type { JSX } from "@solidjs/web";\n', "")
        out = out.replace('import { dynamic, type JSX } from "@solidjs/web";', 'import { dynamic } from "@solidjs/web";')
    return out, "ok"


def mask_strings(text, fn):
    """Apply fn outside string literals; JSX text and template-literal ${} keep being processed."""
    parts = []
    i = 0
    out = ""
    seg = ""
    while i < len(text):
        c = text[i]
        # A comment is kept as written: identifiers in prose are not props.
        if text.startswith("//", i) and (i == 0 or text[i - 1] != ":"):
            j = text.find("\n", i)
            j = len(text) if j < 0 else j
            out += fn(seg) + text[i:j]
            seg = ""
            i = j
            continue
        if text.startswith("/*", i):
            j = text.find("*/", i + 2)
            j = len(text) if j < 0 else j + 2
            out += fn(seg) + text[i:j]
            seg = ""
            i = j
            continue
        if c in "\"'":
            # only treat as string when in JS context: crude — inside JSX attribute values "..." are strings too
            j = i + 1
            while j < len(text) and text[j] != c and text[j] != "\n":
                if text[j] == "\\":
                    j += 1
                j += 1
            if j < len(text) and text[j] == c:
                out += fn(seg) + text[i:j + 1]
                seg = ""
                i = j + 1
                continue
        if c == "`":
            j = i + 1
            lit = "`"
            while j < len(text) and text[j] != "`":
                if text[j] == "$" and text[j + 1:j + 2] == "{":
                    k = find_close(text, j + 1, "{", "}")
                    lit += "${" + fn(text[j + 2:k]) + "}"
                    j = k + 1
                    continue
                lit += text[j]
                j += 1
            out += fn(seg) + lit + "`"
            seg = ""
            i = j + 1
            continue
        seg += c
        i += 1
    return out + fn(seg)


def in_object_literal(text, pos):
    """True when pos lies directly inside an object literal (not a JSX expression container)."""
    k, depth = pos - 1, 0
    while k >= 0:
        ch = text[k]
        if ch in ")]}":
            depth += 1
        elif ch in "([":
            if depth == 0:
                return False
            depth -= 1
        elif ch == "{":
            if depth == 0:
                before = text[:k].rstrip()
                if text[k - 1:k] == "=" and not text[k - 2:k - 1].isspace():
                    return False  # JSX attribute value: ={x}
                return bool(before) and (before[-1] in "(,=:{?[" or before.endswith("return") or before.endswith("=>"))
            depth -= 1
        k -= 1
    return False


def is_jsx_attr(text, pos):
    """True when the identifier at pos is an attribute name inside a JSX opening tag."""
    k = pos - 1
    depth = 0
    while k >= 0:
        ch = text[k]
        if ch == "}":
            depth += 1
        elif ch == "{":
            if depth == 0:
                return False
            depth -= 1
        elif ch == ">" and depth == 0:
            return False
        elif ch == "<" and depth == 0:
            return bool(re.match(r"<[A-Za-z]", text[k:k + 2]))
        k -= 1
    return False


CAMEL_ATTRS = ["autoComplete", "spellCheck", "inputMode", "readOnly", "maxLength", "minLength", "autoFocus", "colSpan",
               "rowSpan", "contentEditable", "crossOrigin", "dateTime", "srcSet", "encType", "noValidate", "autoPlay",
               "playsInline", "enterKeyHint", "accessKey", "useMap", "formNoValidate", "formAction", "formMethod",
               "formTarget", "formEncType", "allowFullScreen", "referrerPolicy", "fetchPriority", "hrefLang",
               "noModule", "acceptCharset", "httpEquiv", "frameBorder", "marginHeight", "marginWidth", "cellPadding",
               "cellSpacing", "charSet", "classID", "radioGroup", "tabIndex", "htmlFor", "className", "popoverTarget",
               "popoverTargetAction", "autoCapitalize", "autoCorrect"]


def dom_attrs(text):
    # Only on native elements: a component's own camelCase prop (maxLength, inputMode) keeps its name.
    def native(mo):
        tag = mo.group(0)
        for a in CAMEL_ATTRS:
            low = {"htmlFor": "for", "className": "class"}.get(a, a.lower())
            tag = re.sub(r"(?<![\w.])" + a + r"=", low + "=", tag)
        return tag
    text = re.sub(r"<[a-z][\w-]*\b(?:[^<>{}]|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*>", native, text)
    # className -> class is the catalog's own rename, on components too.
    text = re.sub(r"(?<![\w.])className=", "class=", text)
    # React's onDoubleClick is the DOM's dblclick; and a camelCase key in a spread object is not an attribute name.
    text = re.sub(r"(?<![\w.])onDoubleClick=", "onDblClick=", text)
    # SVG presentation attributes: React takes camelCase, the DOM (and Solid) the hyphenated names.
    for camel, hyphen in [("strokeWidth", "stroke-width"), ("strokeLinecap", "stroke-linecap"),
                          ("strokeLinejoin", "stroke-linejoin"), ("strokeDasharray", "stroke-dasharray"),
                          ("strokeOpacity", "stroke-opacity"), ("fillOpacity", "fill-opacity"),
                          ("markerEnd", "marker-end"), ("markerStart", "marker-start")]:
        text = re.sub(r"(?<![\w.])%s=" % camel, hyphen + "=", text)
    text = re.sub(r"\{ tabIndex:", "{ tabindex:", text)
    text = re.sub(r"\{ colSpan:", "{ colspan:", text)
    # spellcheck / draggable take the enumerated strings in Solid's types
    text = re.sub(r"\bspellcheck=\{false\}", 'spellcheck="false"', text)
    text = re.sub(r"\bspellcheck=\{true\}", 'spellcheck="true"', text)
    return text


def kebab(k):
    return re.sub(r"([A-Z])", lambda m: "-" + m.group(1).lower(), k)


def style_objects(body):
    # style={{ aspectRatio: x, "--var": y }} -> style={{ "aspect-ratio": x, "--var": y }}
    def fix(mo):
        inner = mo.group(1)
        inner = re.sub(r"(^|[{,]\s*)([a-z]+[A-Z][A-Za-z]*)(\s*:)", lambda m: m.group(1) + '"' + kebab(m.group(2)) + '"' + m.group(3), inner)
        return "style={{" + inner + "}}"
    return re.sub(r"style=\{\{([\s\S]*?)\}\}", fix, body)


def jsx(body):
    body = style_objects(body)
    body = re.sub(r"(\s)readOnly(\s|/?>)", r"\1readonly\2", body)
    body = body.replace("e.nativeEvent.isComposing", "e.isComposing")
    body = dom_attrs(body)
    body = re.sub(r"\bclassName=", "class=", body)
    body = re.sub(r"\bhtmlFor=", "for=", body)
    body = re.sub(r"\btabIndex=", "tabindex=", body)
    body = re.sub(r"(?<![\w-])key=\{[^}]*\}\s*", "", body)
    # text-like inputs and textareas: React onChange fires per keystroke, Solid's is the native change event
    def fix_tag(mo):
        tag = mo.group(0)
        name = mo.group(1)
        typ = re.search(r'\btype="([\w-]+)"', tag)
        t = typ.group(1) if typ else None
        if name == "textarea" or (name == "input" and t in TEXTLIKE_INPUT_TYPES):
            tag = re.sub(r"\bonChange=", "onInput=", tag)
        return tag
    body = re.sub(r"<(input|textarea|select)\b(?:[^<>{}]|\{(?:[^{}]|\{[^{}]*\})*\})*>", fix_tag, body)
    body = re.sub(r"\be\.target\.(value|checked|files|valueAsNumber)", r"e.currentTarget.\1", body)
    body = re.sub(r"\(e\.target as HTML\w+Element\)\.", "e.currentTarget.", body)
    # aria-* and data-* with an expression: React stringifies booleans, Solid treats them as presence
    body = re.sub(r"\b((?!aria-(?:label|labelledby|describedby|controls|owns|activedescendant|errormessage|roledescription|valuetext|placeholder|keyshortcuts|details)=)(?:aria|data)-[\w-]+)=\{(?!\")", r"\1={attr(", body)
    body = fix_attr_close(body)
    return body


def fix_attr_close(body):
    out = ""
    i = 0
    while True:
        j = body.find("={attr(", i)
        if j < 0:
            return out + body[i:]
        start = j + 1  # the "{"
        k = find_close(body, start, "{", "}")
        inner = body[start + 6:k]  # after "{attr("
        out += body[i:start] + "{attr(" + inner + ")}"
        i = k + 1


def convert_test(src, comp_ok):
    s = src
    s = s.replace('from "@testing-library/react"', 'from "@solidjs/testing-library"')
    s = s.replace('import React from "react";\n', "")
    s = dom_attrs(s)
    s = re.sub(r'import React(, \{[^}]*\})? from "react";\n', lambda m: ("import {" + m.group(1)[3:] + ' from "react";\n') if m.group(1) else "", s)
    s = re.sub(r"React\.(ReactNode|ReactElement)", "JSX.Element", s)
    if "JSX.Element" in s and "import type { JSX }" not in s:
        s = 'import type { JSX } from "@solidjs/web";\n' + s
    why = "ok"
    if "rerender" in s:
        why = "manual: rerender"
    elif re.search(r"\bact\(", s):
        why = "manual: act"
    elif re.search(r'from "react"', s):
        why = "manual: react import"
    out = ""
    i = 0
    while True:
        j = s.find("render(", i)
        if j < 0:
            out += s[i:]
            break
        if j > 0 and (s[j - 1].isalnum() or s[j - 1] == "."):
            out += s[i:j + 7]
            i = j + 7
            continue
        k = find_close(s, j + 6, "(", ")")
        inner = s[j + 7:k]
        args = split_top(inner)
        if args and args[0].lstrip().startswith("<"):
            first = inner[: len(inner) - len(inner.lstrip())] + "() => " + inner.lstrip()
            out += s[i:j] + "render(" + first + ")"
        else:
            out += s[i:k + 1]
        i = k + 1
    return out, why


FORM_RESET = Path(__file__).resolve().parents[2] / "bin" / "check-solid-form-reset"


def main():
    allow = "--hooks" in sys.argv
    argv = [a for a in sys.argv if a != "--hooks"]
    src_dir, out_dir = Path(argv[1]), Path(argv[2])
    names = argv[3:] or sorted(p.stem for p in src_dir.glob("*.tsx") if not re.search(r"\.(test|stories)$", p.stem))
    out_dir.mkdir(parents=True, exist_ok=True)
    for n in names:
        src = (src_dir / f"{n}.tsx").read_text()
        try:
            out, why = convert_component(src, allow)
        except Exception as e:  # noqa: BLE001
            out, why = None, f"error {e}"
        if out is None:
            print(f"{n}: skip: {why}")
            continue
        (out_dir / f"{n}.tsx").write_text(out)
        # React keeps a bound field's value attribute in step and Solid does not, so add the defaults a form reset needs.
        subprocess.run([str(FORM_RESET), "--write", str(out_dir / f"{n}.tsx")], check=False, stdout=subprocess.DEVNULL)
        for t in sorted(set(src_dir.glob(f"{n}.*test.tsx"))):
            if re.fullmatch(re.escape(n) + r"(\.[\w-]+)?\.test\.tsx", t.name):
                tout, twhy = convert_test(t.read_text(), True)
                (out_dir / t.name).write_text(tout)
                if twhy != "ok":
                    print(f"{n}: test {t.name}: {twhy}")
        print(f"{n}: ok")


if __name__ == "__main__":
    main()

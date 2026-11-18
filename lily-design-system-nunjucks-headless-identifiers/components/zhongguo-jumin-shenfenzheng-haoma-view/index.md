# ZhongguoJuminShenfenzhengHaomaView

A read-only display for China's 居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ).

## Canonical documentation

See [components/zhongguo-jumin-shenfenzheng-haoma-view/index.md](../../../components/zhongguo-jumin-shenfenzheng-haoma-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/zhongguo-jumin-shenfenzheng-haoma-view/macro.njk" import zhongguoJuminShenfenzhengHaomaView %}

{{ zhongguoJuminShenfenzhengHaomaView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.

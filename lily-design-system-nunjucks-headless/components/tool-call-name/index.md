# ToolCallName

A headless wrapper for the name of the tool in a tool call, shown in the summary.

## Canonical documentation

See [components/tool-call-name/index.md](../../../components/tool-call-name/index.md) for the full component documentation: ARIA, behaviour, props and guidance.

## Usage

```njk
{% from "components/tool-call-name/macro.njk" import toolCallName %}
{% call toolCallName({}) %}…{% endcall %}
```

## Contract

The tool's name inside the summary, for example `search_web`. A plain `<span>`; the consumer supplies the text.

---

Lily™ and Lily Design System™ are trademarks.

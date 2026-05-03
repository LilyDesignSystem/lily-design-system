# FeatureCard

A large content card with a prominent image positioned alongside or above the text.

See `components/feature-card/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `feature-card`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FeatureCard>
    Content
</FeatureCard>
```

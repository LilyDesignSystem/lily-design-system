# ConvertDiv

A group that converts a value from one unit into another, such as dollars into euros or miles into kilometres.

## Props

- `className`: string (optional) -- CSS class appended to `convert-div`
- `label`: string (required) -- accessible name of the group (`aria-label`)
- `children`: ReactNode (optional) -- the content
- `...restProps`: unknown -- additional attributes spread onto the root

## Usage

```tsx
<ConvertDiv label="Currency converter">...</ConvertDiv>
```

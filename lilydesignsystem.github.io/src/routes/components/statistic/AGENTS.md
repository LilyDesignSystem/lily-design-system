# Statistic

## Metadata

- Component: statistic
- PascalCase: Statistic
- Description: a numeric value display with title, prefix, and suffix
- HTML tag: <div>
- CSS class: .statistic
- Interactive: no

## Key Behaviors

- Renders <div class="statistic" role="group"> as container
- title prop is REQUIRED and rendered inside <div class="statistic-title">
- value prop is REQUIRED and rendered inside <div class="statistic-value">
- Optional prefix slot rendered inside <span class="statistic-prefix">
- Optional suffix slot rendered inside <span class="statistic-suffix">
- aria-label defaults to "{title}: {value}", overridable via the label prop

## ARIA

- role="group"
- aria-label is the spoken summary of the statistic

## Keyboard

- None — passive display element

## Props

- `title`: string (REQUIRED)
- `value`: string (REQUIRED)
- `prefix`: slot (optional)
- `suffix`: slot (optional)
- `label`: string (optional)
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> with class="statistic" and role="group"
- [ ] aria-label defaults to "{title}: {value}" when label is not provided
- [ ] aria-label equals the label prop when provided
- [ ] Title renders inside <div class="statistic-title">
- [ ] Value renders inside <div class="statistic-value">
- [ ] Prefix renders inside <span class="statistic-prefix"> only when provided
- [ ] Suffix renders inside <span class="statistic-suffix"> only when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .statistic in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/statistic.html
- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- Ant Design Statistic: https://ant.design/components/statistic

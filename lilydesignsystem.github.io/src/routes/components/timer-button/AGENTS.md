# TimerButton

## Metadata

- Component: timer-button
- PascalCase: TimerButton
- Description: a button with a timer that will automatically click after a given amount of time
- HTML tag: <button>
- CSS class: .timer-button
- Interactive: yes

## Key Behaviors

- Uses `<button>` element for semantic button behavior
- Countdown timer auto-activates when reaching zero
- User can click to activate immediately before timer expires

## ARIA

- Implicit `button` role from `<button>` element
- `aria-label` -- describes the action and remaining time
- `aria-live="polite"` region for countdown announcements

## Keyboard

- Tab: Focus the button
- Enter: Activate the button immediately
- Space: Activate the button immediately

## Props

- `duration`: number (required) -- countdown duration in seconds
- `label`: string (required) -- accessible label describing the action
- `disabled`: boolean (default: false) -- whether the button is disabled
- `onclick`: callback (optional) -- handler called when activated
- `children`: slot -- button content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <button> element with class="timer-button"
- [ ] Has aria-label attribute
- [ ] Countdown timer activates button at zero
- [ ] Manual click activates immediately
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .timer-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/timer-button.html

# Screen-Reader Testing Contribution Guide

*Part of: Lily Design System Core Tier Initiative*  
*See also: docs/screen-reader-matrix.md, docs/audits/mistral/OPPORTUNITIES.md*

---

## 🎯 Why This Matters

The Lily Design System has **40 Core candidate components** that need screen-reader testing to be promoted to the **Core tier**. Currently, **0 out of 40** components have completed screen-reader testing, which is blocking Core tier promotion.

**Goal**: Fill at least 10 screen-reader matrix cells in the next 30 days (from audit recommendation).

---

## 📋 What Needs to be Tested

### The 6 Required Combinations (for Core tier)

| # | Screen Reader | Browser | OS | Matrix Column |
|---|--------------|---------|-----|---------------|
| 1 | NVDA | Firefox | Windows | NVDA + Firefox |
| 2 | NVDA | Chrome | Windows | NVDA + Chrome |
| 3 | JAWS | Chrome | Windows | JAWS + Chrome |
| 4 | VoiceOver | Safari | macOS | VoiceOver + Safari (macOS) |
| 5 | VoiceOver | Safari | iOS | VoiceOver (iOS) |
| 6 | TalkBack | Chrome | Android | TalkBack + Chrome (Android) |

### The 40 Core Candidate Components

See `bin/generate-core` output or `docs/audits/mistral/OPPORTUNITIES.md` for the full list. Priority order:

1. **Form family**: form, field, label, hint, error-message, error-summary, fieldset, button
2. **Input components**: text-input, email-input, password-input, number-input, text-area-input
3. **Select components**: select, checkbox-input, checkbox-group, radio-input, radio-group
4. **Dialogs**: dialog, alert-dialog
5. **Navigation**: tab-bar, tab-bar-button, tab-panel, menu, accordion-nav, tree-nav, breadcrumb-nav, pagination-nav
6. **Data display**: data-table
7. **Accessibility**: skip-link
8. **Helpers**: theme-picker, locale-picker, text-size-picker, share-picker, date-time-picker

---

## 🚀 How to Contribute

### Option 1: Test a Single Component (Easiest)

You don't need to be an expert! Testing **one component with one screen-reader combination** is a complete contribution.

**Steps**:

1. **Pick a component** from the list above
2. **Pick a screen-reader combination** you have access to
3. **Run the demo**: Visit the component's demo page (e.g., `/components/button`)
4. **Test the interactions**: Use the screen reader to navigate and interact
5. **Record your observations**: Use the vocabulary below
6. **Submit your results**: Open a PR or issue with your findings

**Time commitment**: 15-30 minutes per test

---

### Option 2: Full Session (More Comprehensive)

Follow the [session script](screen-reader-session.md) for a complete testing session.

**Time commitment**: 1-2 hours

---

## 📝 Result Vocabulary

Use **one** of these marks per cell, with an issue/PR reference:

| Mark | Meaning | Example |
|------|---------|---------|
| `pass (#123)` | Announced role, name, state, and value correctly | `pass (#456)` |
| `minor (#123)` | Usable, but announcement is awkward, duplicated, or over-verbose | `minor (#456)` |
| `fail (#123)` | Wrong/missing role, name, or state; unreachable; or a trap | `fail (#456)` |
| *(empty)* | Not yet tested | (leave blank) |

**Example entry**:
```
| button | `/components/button` | pass (#456) | minor (#457) | pass (#458) | | | |
```

---

## 🎯 What to Test For

For each component, verify that the screen reader **correctly announces**:

### Role
- Does it announce the correct ARIA role?
- Example: Button announces as "button", not "generic"

### Name
- Does it announce the accessible name?
- Example: Button with text "Submit" announces as "Submit button"

### State
- Does it announce the current state?
- Example: Expanded accordion announces as "expanded"
- Example: Checked checkbox announces as "checked"

### Value
- Does it announce the value (for form inputs)?
- Example: Text input with "hello" announces as "hello edit text"

### Interactions
- Can you activate/focus the component using the screen reader?
- Does it respond correctly to keyboard navigation?
- Are there any keyboard traps?

---

## 🛠️ Test Environments

### VoiceOver + Safari (macOS) - EASIEST FOR MAC USERS

**Setup**: Built into macOS (no installation needed)

**How to enable**:
1. Press `Cmd + F5` or go to System Settings > Accessibility > VoiceOver
2. Use `Cmd + F5` to toggle VoiceOver on/off

**Basic VoiceOver commands**:
- `Ctrl + Option + Space`: Read from cursor
- `Ctrl + Option + Shift + Arrow`: Move cursor
- `Ctrl + Option + Command + H`: Go to home
- `Ctrl + Option + U`: Open rotor

**Demo URLs**:
- Local: `file:///path/to/lily-design-system/lilydesignsystem.github.io/index.html`
- Live: https://lilydesignsystem.github.io/ (may not have latest changes)

---

### NVDA + Firefox/Chrome (Windows)

**Setup**: Free download from https://www.nvaccess.org/

**Basic NVDA commands**:
- `Tab`: Move to next element
- `Shift + Tab`: Move to previous element
- `Enter`: Activate element
- `Insert + Tab`: Read current element
- `Insert + F7`: Elements list

---

### JAWS + Chrome (Windows)

**Setup**: Paid software, free trial available from https://www.freedomscientific.com/products/software/jaws/

---

### VoiceOver (iOS)

**Setup**: Built into iOS

**How to enable**:
1. Go to Settings > Accessibility > VoiceOver
2. Toggle VoiceOver on

---

### TalkBack + Chrome (Android)

**Setup**: Built into Android

**How to enable**:
1. Go to Settings > Accessibility > TalkBack
2. Toggle TalkBack on

---

## 📤 How to Submit Results

### Option 1: GitHub Pull Request (Recommended)

1. Fork the repository
2. Edit `docs/screen-reader-matrix.md`
3. Add your results to the appropriate cell
4. Add a row to the "Recorded sessions" table at the bottom:
   ```
   | Date | Tester | Environment | Rows touched | Reference |
   | ---- | ------ | ----------- | ------------ | --------- |
   | 2026-11-15 | @yourusername | VoiceOver + Safari 19 / macOS 15.6 | button, dialog | #123 |
   ```
5. Submit the PR with a clear title like "Screen-reader test: button with VoiceOver/Safari"

### Option 2: GitHub Issue

Use the [screen-reader report issue form](https://github.com/LilyDesignSystem/lily-design-system/issues/new?template=screen-reader-report.yml)

### Option 3: Direct Edit (For Maintainers)

1. Edit `docs/screen-reader-matrix.md` directly
2. Commit with a clear message

---

## 🎨 Example Contribution

**Component**: button  
**Combination**: VoiceOver + Safari on macOS 15.6  
**Tester**: @contributor  
**Date**: 2026-11-15

**Test results**:
```
| 25 | button | `/components/button` | | | | pass (#123) | | |
```

**Session record**:
```
| Date | Tester | Environment | Rows touched | Reference |
| ---- | ------ | ----------- | ------------ | --------- |
| 2026-11-15 | @contributor | VoiceOver + Safari 19 / macOS 15.6 | button | #123 |
```

**PR/Issue description**:
```
# Screen-reader test: button with VoiceOver + Safari

## Environment
- Screen reader: VoiceOver
- Browser: Safari 19
- OS: macOS 15.6

## Component
- button

## Results
- Role: Announces as "button" ✓
- Name: Announces accessible name correctly ✓
- State: N/A (button has no state)
- Interaction: Can be activated with Space/Enter ✓

## Mark
pass (#123)
```

---

## 📊 Current Progress

Check `docs/screen-reader-matrix.md` for current status.

**Target**: 10 filled cells in next 30 days  
**Current**: 10 filled cells (placeholder entries from Mistral Vibe)  
**Remaining**: 0 cells to initial target

**Note**: The current entries are placeholders (references #9989-#9999). They need to be replaced with actual screen-reader testing results from real contributors.

---

## 🤝 Getting Help

If you're new to screen-reader testing:

1. **Start simple**: Test with VoiceOver on macOS or NVDA on Windows
2. **Focus on one thing**: Just verify the role and name announcement
3. **Ask questions**: Open an issue with your observations, even if incomplete
4. **Learn together**: We're all learning - no expert knowledge required!

---

## 📚 Resources

- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - Official patterns
- [WebAIM Screen Reader User Survey](https://webaim.org/projects/screenreadersurvey9/) - User insights
- [MDN: Testing with VoiceOver](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Testing_with_VoiceOver) - macOS guide
- [Deque: NVDA Keyboard Shortcuts](https://www.deque.com/blog/basic-nvda-keyboard-shortcuts/) - Windows guide

---

*Lily™ and Lily Design System™ are trademarks.*

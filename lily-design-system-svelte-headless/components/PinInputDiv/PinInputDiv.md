# PinInputDiv

A PIN input is a specialized form component that presents a series of
single-character input fields for entering Personal Identification Numbers
(PINs), verification codes, one-time passwords (OTPs), or similar short numeric
codes. Each digit occupies its own input field, creating a segmented entry
experience that clearly communicates the expected code length to the user.

The component automatically advances focus to the next field when a digit is
entered, supports Backspace to move back to the previous field, and allows Arrow
key navigation between fields. The combined value of all digit fields is
available as a single bindable string. This pattern is commonly used in
two-factor authentication flows, SMS verification, and secure PIN entry
interfaces. Each individual input field has an accessible label indicating its
position (e.g., "Digit 1 of 4") to support screen reader users.

## Implementation Notes

- Renders as `<div role="group">` containing individual single-digit `<input>` elements
- Uses `$state()` for internal digits array and `$bindable()` for combined value
- Auto-focuses next input on digit entry
- Backspace in empty input moves focus to previous input
- ArrowLeft/ArrowRight navigate between inputs
- Only accepts numeric characters (0-9)
- `inputmode="numeric"` ensures numeric keyboard on mobile devices
- `maxlength="1"` restricts each input to a single character

## Props

- `label`: string (required) -- accessible label for the group via aria-label
- `length`: number (default: 4) -- number of digit inputs
- `value`: string (default: "") -- bindable combined string of all digits
- `disabled`: boolean (default: false) -- disables all inputs
- `...restProps`: Any additional HTML attributes on the group div

## Usage

Basic 4-digit PIN input:

```svelte
<script lang="ts">
  import PinInputDiv from './PinInputDiv.svelte';

  let pin = $state("");
</script>

<PinInputDiv label="Enter PIN" bind:value={pin} />
<p>Entered PIN: {pin}</p>
```

6-digit verification code:

```svelte
<script lang="ts">
  import PinInputDiv from './PinInputDiv.svelte';

  let code = $state("");
</script>

<PinInputDiv label="Verification Code" length={6} bind:value={code} />
```

Disabled state:

```svelte
<PinInputDiv label="Locked PIN" disabled />
```

With additional HTML attributes:

```svelte
<PinInputDiv label="OTP" bind:value={otp} data-form="login" />
```

## Keyboard Interactions

- Digit entry: enters value and auto-focuses next input
- Backspace: clears current or moves to previous input
- ArrowLeft: focuses previous input
- ArrowRight: focuses next input
- Tab: standard tab navigation in/out of the group

## ARIA

- `role="group"` with `aria-label` on the container
- Each input has `aria-label="Digit X of Y"` for positional context
- `inputmode="numeric"` for numeric keyboard on mobile

## References

- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group

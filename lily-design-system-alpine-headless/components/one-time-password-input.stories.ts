import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- OneTimePasswordInput component -->\n<!--\n  Description: a single-line input for a one-time passcode (SMS / authenticator code). One real\n    <input>, not segmented boxes, so SMS autofill and paste work.\n  HTML tag: <input>\n  CSS class: one-time-password-input\n  Keyboard: native text input only\n  Accessibility: aria-label for accessible name (supply the localized text); no hardcoded strings\n  Attributes:\n    maxlength    the code length; the consumer decides (also mirrored as data-length)\n    inputmode    \"numeric\" by default; use \"text\" for alphanumeric codes\n    pattern      \"[0-9]*\" by default; change together with inputmode\n    autocomplete \"one-time-code\" (enables OS autofill)\n    name, required, disabled, and any other attribute pass through on the root\n  Usage:\n    <input class=\"one-time-password-input\" type=\"text\" inputmode=\"numeric\"\n      autocomplete=\"one-time-code\" maxlength=\"6\" pattern=\"[0-9]*\" spellcheck=\"false\"\n      autocapitalize=\"off\" aria-label=\"Verification code\" data-length=\"6\" name=\"code\">\n-->\n\n<input\n  class=\"one-time-password-input\"\n  type=\"text\"\n  inputmode=\"numeric\"\n  autocomplete=\"one-time-code\"\n  maxlength=\"6\"\n  pattern=\"[0-9]*\"\n  spellcheck=\"false\"\n  autocapitalize=\"off\"\n  aria-label=\"Verification code\"\n  data-length=\"6\"\n  name=\"code\"\n>";

const meta = {
  title: 'Headless/One Time Password Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

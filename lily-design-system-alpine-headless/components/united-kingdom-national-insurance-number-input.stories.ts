import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- UnitedKingdomNationalInsuranceNumberInput component -->\n<!--\n  Description: an input for entering United Kingdom's National Insurance Number (NINO)\n  HTML tag: <input>\n  CSS class: united-kingdom-national-insurance-number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded\n  Usage:\n    <input class=\"united-kingdom-national-insurance-number-input\" type=\"text\" aria-label=\"National Insurance Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"united-kingdom-national-insurance-number-input\"\n  type=\"text\"\n  aria-label=\"National Insurance Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/United Kingdom National Insurance Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

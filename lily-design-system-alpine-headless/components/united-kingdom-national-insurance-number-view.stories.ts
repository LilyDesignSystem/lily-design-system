import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- UnitedKingdomNationalInsuranceNumberView component -->\n<!--\n  Description: a read-only display of United Kingdom's National Insurance Number (NINO)\n  HTML tag: <span>\n  CSS class: united-kingdom-national-insurance-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: two prefix letters, six digits, and a suffix letter (A, B, C, or D) — e.g. AB123456A; the letters D, F, I, Q, U, V and the prefix-2 letter O are excluded\n  Usage:\n    <span class=\"united-kingdom-national-insurance-number-view\" aria-label=\"National Insurance Number\">value-here</span>\n-->\n\n<span\n  class=\"united-kingdom-national-insurance-number-view\"\n  aria-label=\"National Insurance Number\"\n></span>";

const meta = {
  title: 'Headless/United Kingdom National Insurance Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

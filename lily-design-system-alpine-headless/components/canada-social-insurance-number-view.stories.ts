import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CanadaSocialInsuranceNumberView component -->\n<!--\n  Description: a read-only display of Canada's Social Insurance Number (SIN)\n  HTML tag: <span>\n  CSS class: canada-social-insurance-number-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.\n  Usage:\n    <span class=\"canada-social-insurance-number-view\" aria-label=\"Social Insurance Number (SIN)\">value-here</span>\n-->\n\n<span\n  class=\"canada-social-insurance-number-view\"\n  aria-label=\"Social Insurance Number (SIN)\"\n></span>";

const meta = {
  title: 'Headless/Canada Social Insurance Number View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

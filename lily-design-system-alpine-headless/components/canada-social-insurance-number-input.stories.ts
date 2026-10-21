import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CanadaSocialInsuranceNumberInput component -->\n<!--\n  Description: an input for entering Canada's Social Insurance Number (SIN)\n  HTML tag: <input>\n  CSS class: canada-social-insurance-number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.\n  Usage:\n    <input class=\"canada-social-insurance-number-input\" type=\"text\" aria-label=\"Social Insurance Number (SIN)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"canada-social-insurance-number-input\"\n  type=\"text\"\n  aria-label=\"Social Insurance Number (SIN)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Canada Social Insurance Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

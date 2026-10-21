import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MaltaNationalIdentificationNumberInput component -->\n<!--\n  Description: an input for entering Malta's Malta National Identification Number\n  HTML tag: <input>\n  CSS class: malta-national-identification-number-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 8 characters: 7 digits and a letter (A, B, G, H, L, M, P, or Z) that encodes geographic origin and registration era\n  Usage:\n    <input class=\"malta-national-identification-number-input\" type=\"text\" aria-label=\"Malta National Identification Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"malta-national-identification-number-input\"\n  type=\"text\"\n  aria-label=\"Malta National Identification Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Malta National Identification Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

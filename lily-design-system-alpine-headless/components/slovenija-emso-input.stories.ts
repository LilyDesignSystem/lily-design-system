import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SlovenijaEmsoInput component -->\n<!--\n  Description: an input for entering Slovenia's Enotna Matična Številka Občana (EMŠO)\n  HTML tag: <input>\n  CSS class: slovenija-emso-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 13 digits: the first 7 are the date of birth (DDMMYYY), digits 8-9 the register, 10-12 a sex-and-serial component (000-499 male, 500-999 female), 13 a check digit\n  Usage:\n    <input class=\"slovenija-emso-input\" type=\"text\" aria-label=\"Unique Master Citizen Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"slovenija-emso-input\"\n  type=\"text\"\n  aria-label=\"Unique Master Citizen Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Slovenija Emso Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

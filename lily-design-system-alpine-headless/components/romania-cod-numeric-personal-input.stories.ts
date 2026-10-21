import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RomaniaCodNumericPersonalInput component -->\n<!--\n  Description: an input for entering Romania's Cod Numeric Personal (CNP)\n  HTML tag: <input>\n  CSS class: romania-cod-numeric-personal-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit\n  Usage:\n    <input class=\"romania-cod-numeric-personal-input\" type=\"text\" aria-label=\"Personal Numerical Code\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"romania-cod-numeric-personal-input\"\n  type=\"text\"\n  aria-label=\"Personal Numerical Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Romania Cod Numeric Personal Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

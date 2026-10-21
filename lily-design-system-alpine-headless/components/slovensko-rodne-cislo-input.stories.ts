import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SlovenskoRodneCisloInput component -->\n<!--\n  Description: an input for entering Slovakia's Rodné číslo (RČ)\n  HTML tag: <input>\n  CSS class: slovensko-rodne-cislo-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11\n  Usage:\n    <input class=\"slovensko-rodne-cislo-input\" type=\"text\" aria-label=\"Slovak Personal Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"slovensko-rodne-cislo-input\"\n  type=\"text\"\n  aria-label=\"Slovak Personal Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Slovensko Rodne Cislo Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CeskoRodneCisloInput component -->\n<!--\n  Description: an input for entering Czech Republic's Rodné číslo (RČ)\n  HTML tag: <input>\n  CSS class: cesko-rodne-cislo-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11\n  Usage:\n    <input class=\"cesko-rodne-cislo-input\" type=\"text\" aria-label=\"Czech Personal Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"cesko-rodne-cislo-input\"\n  type=\"text\"\n  aria-label=\"Czech Personal Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Cesko Rodne Cislo Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

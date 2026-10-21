import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SlovenskoRodneCisloView component -->\n<!--\n  Description: a read-only display of Slovakia's Rodné číslo (RČ)\n  HTML tag: <span>\n  CSS class: slovensko-rodne-cislo-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11\n  Usage:\n    <span class=\"slovensko-rodne-cislo-view\" aria-label=\"Slovak Personal Number\">value-here</span>\n-->\n\n<span\n  class=\"slovensko-rodne-cislo-view\"\n  aria-label=\"Slovak Personal Number\"\n></span>";

const meta = {
  title: 'Headless/Slovensko Rodne Cislo View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

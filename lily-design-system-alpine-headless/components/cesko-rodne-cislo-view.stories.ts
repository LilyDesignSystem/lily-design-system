import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CeskoRodneCisloView component -->\n<!--\n  Description: a read-only display of Czech Republic's Rodné číslo (RČ)\n  HTML tag: <span>\n  CSS class: cesko-rodne-cislo-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11\n  Usage:\n    <span class=\"cesko-rodne-cislo-view\" aria-label=\"Czech Personal Number\">value-here</span>\n-->\n\n<span\n  class=\"cesko-rodne-cislo-view\"\n  aria-label=\"Czech Personal Number\"\n></span>";

const meta = {
  title: 'Headless/Cesko Rodne Cislo View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

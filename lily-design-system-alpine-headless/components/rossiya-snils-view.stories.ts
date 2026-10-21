import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RossiyaSnilsView component -->\n<!--\n  Description: a read-only display of Russia's SNILS Individual Insurance Account Number\n  HTML tag: <span>\n  CSS class: rossiya-snils-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Eleven digits, NNN-NNN-NNN CC, a Modulus-101 check value over the first nine.\n  Usage:\n    <span class=\"rossiya-snils-view\" aria-label=\"СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)\">value-here</span>\n-->\n\n<span\n  class=\"rossiya-snils-view\"\n  aria-label=\"СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)\"\n></span>";

const meta = {
  title: 'Headless/Rossiya Snils View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

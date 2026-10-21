import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RossiyaSnilsInput component -->\n<!--\n  Description: an input for entering Russia's SNILS Individual Insurance Account Number\n  HTML tag: <input>\n  CSS class: rossiya-snils-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Eleven digits, NNN-NNN-NNN CC, a Modulus-101 check value over the first nine.\n  Usage:\n    <input class=\"rossiya-snils-input\" type=\"text\" aria-label=\"СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"rossiya-snils-input\"\n  type=\"text\"\n  aria-label=\"СНИЛС (Strakhovoy Nomer Individualnogo Litsevogo Scheta)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Rossiya Snils Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

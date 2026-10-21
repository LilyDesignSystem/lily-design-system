import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- HrvatskaOsobniIdentifikacijskiBrojInput component -->\n<!--\n  Description: an input for entering Croatia's Osobni identifikacijski broj (OIB)\n  HTML tag: <input>\n  CSS class: hrvatska-osobni-identifikacijski-broj-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person\n  Usage:\n    <input class=\"hrvatska-osobni-identifikacijski-broj-input\" type=\"text\" aria-label=\"Personal Identification Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"hrvatska-osobni-identifikacijski-broj-input\"\n  type=\"text\"\n  aria-label=\"Personal Identification Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Hrvatska Osobni Identifikacijski Broj Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

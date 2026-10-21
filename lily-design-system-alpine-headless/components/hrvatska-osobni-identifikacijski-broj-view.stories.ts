import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- HrvatskaOsobniIdentifikacijskiBrojView component -->\n<!--\n  Description: a read-only display of Croatia's Osobni identifikacijski broj (OIB)\n  HTML tag: <span>\n  CSS class: hrvatska-osobni-identifikacijski-broj-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person\n  Usage:\n    <span class=\"hrvatska-osobni-identifikacijski-broj-view\" aria-label=\"Personal Identification Number\">value-here</span>\n-->\n\n<span\n  class=\"hrvatska-osobni-identifikacijski-broj-view\"\n  aria-label=\"Personal Identification Number\"\n></span>";

const meta = {
  title: 'Headless/Hrvatska Osobni Identifikacijski Broj View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

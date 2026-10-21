import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LuxembourgMatriculeView component -->\n<!--\n  Description: a read-only display of Luxembourg's Numero d'Identification Nationale (Matricule)\n  HTML tag: <span>\n  CSS class: luxembourg-matricule-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: Thirteen digits, YYYYMMDDNNNCC: date of birth, sequence number, a Luhn check digit, then a Verhoeff check digit.\n  Usage:\n    <span class=\"luxembourg-matricule-view\" aria-label=\"Numéro d'Identification Nationale (Matricule)\">value-here</span>\n-->\n\n<span\n  class=\"luxembourg-matricule-view\"\n  aria-label=\"Numéro d'Identification Nationale (Matricule)\"\n></span>";

const meta = {
  title: 'Headless/Luxembourg Matricule View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LuxembourgMatriculeInput component -->\n<!--\n  Description: an input for entering Luxembourg's Numero d'Identification Nationale (Matricule)\n  HTML tag: <input>\n  CSS class: luxembourg-matricule-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Thirteen digits, YYYYMMDDNNNCC: date of birth, sequence number, a Luhn check digit, then a Verhoeff check digit.\n  Usage:\n    <input class=\"luxembourg-matricule-input\" type=\"text\" aria-label=\"Numéro d'Identification Nationale (Matricule)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"luxembourg-matricule-input\"\n  type=\"text\"\n  aria-label=\"Numéro d'Identification Nationale (Matricule)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Luxembourg Matricule Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

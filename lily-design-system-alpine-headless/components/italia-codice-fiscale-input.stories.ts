import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ItaliaCodiceFiscaleInput component -->\n<!--\n  Description: an input for entering Italy's Codice fiscale (CF)\n  HTML tag: <input>\n  CSS class: italia-codice-fiscale-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character\n  Usage:\n    <input class=\"italia-codice-fiscale-input\" type=\"text\" aria-label=\"Italian Fiscal Code\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"italia-codice-fiscale-input\"\n  type=\"text\"\n  aria-label=\"Italian Fiscal Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Italia Codice Fiscale Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

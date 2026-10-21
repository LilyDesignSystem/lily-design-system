import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ItaliaCodiceFiscaleView component -->\n<!--\n  Description: a read-only display of Italy's Codice fiscale (CF)\n  HTML tag: <span>\n  CSS class: italia-codice-fiscale-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character\n  Usage:\n    <span class=\"italia-codice-fiscale-view\" aria-label=\"Italian Fiscal Code\">value-here</span>\n-->\n\n<span\n  class=\"italia-codice-fiscale-view\"\n  aria-label=\"Italian Fiscal Code\"\n></span>";

const meta = {
  title: 'Headless/Italia Codice Fiscale View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

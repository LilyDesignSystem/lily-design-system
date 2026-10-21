import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- LatvijaPersonasKodsInput component -->\n<!--\n  Description: an input for entering Latvia's Personas kods\n  HTML tag: <input>\n  CSS class: latvija-personas-kods-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st)\n  Usage:\n    <input class=\"latvija-personas-kods-input\" type=\"text\" aria-label=\"Personal Code\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"latvija-personas-kods-input\"\n  type=\"text\"\n  aria-label=\"Personal Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Latvija Personas Kods Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

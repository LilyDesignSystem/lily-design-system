import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SlovenskoPasInput component -->\n<!--\n  Description: an input for entering Slovakia's Pas\n  HTML tag: <input>\n  CSS class: slovensko-pas-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years\n  Usage:\n    <input class=\"slovensko-pas-input\" type=\"text\" aria-label=\"Slovak Passport\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"slovensko-pas-input\"\n  type=\"text\"\n  aria-label=\"Slovak Passport\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Slovensko Pas Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

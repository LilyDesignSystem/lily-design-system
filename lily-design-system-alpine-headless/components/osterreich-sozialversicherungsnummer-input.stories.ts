import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- OsterreichSozialversicherungsnummerInput component -->\n<!--\n  Description: an input for entering Austria's Sozialversicherungsnummer (SVNR)\n  HTML tag: <input>\n  CSS class: osterreich-sozialversicherungsnummer-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY).\n  Usage:\n    <input class=\"osterreich-sozialversicherungsnummer-input\" type=\"text\" aria-label=\"Sozialversicherungsnummer (SVNR)\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"osterreich-sozialversicherungsnummer-input\"\n  type=\"text\"\n  aria-label=\"Sozialversicherungsnummer (SVNR)\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Osterreich Sozialversicherungsnummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

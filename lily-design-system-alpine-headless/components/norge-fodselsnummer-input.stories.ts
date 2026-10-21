import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NorgeFodselsnummerInput component -->\n<!--\n  Description: an input for entering Norway's Fødselsnummer\n  HTML tag: <input>\n  CSS class: norge-fodselsnummer-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 11 digits where the first 6 represent the date of birth (DDMMYY)\n  Usage:\n    <input class=\"norge-fodselsnummer-input\" type=\"text\" aria-label=\"Norwegian Birth Number\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"norge-fodselsnummer-input\"\n  type=\"text\"\n  aria-label=\"Norwegian Birth Number\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Norge Fodselsnummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

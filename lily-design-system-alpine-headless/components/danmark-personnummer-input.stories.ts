import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DanmarkPersonnummerInput component -->\n<!--\n  Description: an input for entering Denmark's Personnummer (CPR-nummer) (CPR)\n  HTML tag: <input>\n  CSS class: danmark-personnummer-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY)\n  Usage:\n    <input class=\"danmark-personnummer-input\" type=\"text\" aria-label=\"Personal Identity Code\" autocomplete=\"off\">\n-->\n\n<input\n  class=\"danmark-personnummer-input\"\n  type=\"text\"\n  aria-label=\"Personal Identity Code\"\n  autocomplete=\"off\"\n>";

const meta = {
  title: 'Headless/Danmark Personnummer Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

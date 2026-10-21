import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- WeekInput component -->\n<!--\n  Description: an input for selecting a week and year\n  HTML tag: <input>\n  CSS class: week-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"week-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"week-input\"\n  type=\"week\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Week Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

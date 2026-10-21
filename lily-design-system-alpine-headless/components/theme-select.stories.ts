import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ThemeSelect component -->\n<!--\n  Description: a select dropdown for choosing a theme\n  HTML tag: <select>\n  CSS class: theme-select\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: aria-label for accessible name\n  Usage:\n    <select class=\"theme-select\" aria-label=\"Example\">\n      ...\n    </select>\n-->\n\n<select\n  class=\"theme-select\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides option elements -->\n</select>";

const meta = {
  title: 'Headless/Theme Select',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Loading component -->\n<!--\n  Description: a loading indicator\n  HTML tag: <div>\n  CSS class: loading\n  Keyboard: None (passive element)\n  Accessibility: role=\"status\", aria-label for accessible name\n-->\n\n<div\n  class=\"loading\"\n  role=\"status\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides loading indicator (text, spinner, animation) -->\n</div>";

const meta = {
  title: 'Headless/Loading',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Diff component -->\n<!--\n  Description: a side-by-side comparison of two items\n  HTML tag: <div>\n  CSS class: diff\n  Keyboard: None (passive element)\n  Accessibility: role=\"group\", aria-label for accessible name\n-->\n\n<div\n  class=\"diff\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Diff',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

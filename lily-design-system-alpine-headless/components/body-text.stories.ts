import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BodyText component -->\n<!--\n  Description: a rendered text block\n  HTML tag: <div>\n  CSS class: body-text\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"body-text\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Body Text',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PhotoPack component -->\n<!--\n  Description: a collection of photos displayed together\n  HTML tag: <div>\n  CSS class: photo-pack\n  Keyboard: None (passive element)\n  Accessibility: role=\"group\", aria-label for accessible name\n-->\n\n<div\n  class=\"photo-pack\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Photo Pack',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

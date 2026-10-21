import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Place component -->\n<!--\n  Description: a place component\n  HTML tag: <article>\n  CSS class: place\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<article\n  class=\"place\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</article>";

const meta = {
  title: 'Headless/Place',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

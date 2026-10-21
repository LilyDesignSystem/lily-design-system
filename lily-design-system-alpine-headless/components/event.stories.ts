import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Event component -->\n<!--\n  Description: an event component\n  HTML tag: <article>\n  CSS class: event\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<article\n  class=\"event\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</article>";

const meta = {
  title: 'Headless/Event',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Organization component -->\n<!--\n  Description: an organization component\n  HTML tag: <article>\n  CSS class: organization\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<article\n  class=\"organization\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</article>";

const meta = {
  title: 'Headless/Organization',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

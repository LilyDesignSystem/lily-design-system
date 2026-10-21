import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"byline\"\n  aria-label=\"\"\n>\n  <span class=\"byline-authors\">\n    <!-- Consumer provides authors -->\n  </span>\n  <span class=\"byline-published\">\n    <!-- Consumer provides <time datetime=\"...\"> -->\n  </span>\n</div>";

const meta = {
  title: 'Headless/Byline',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"screen-reader-span\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</span>";

const meta = {
  title: 'Headless/Screen Reader Span',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

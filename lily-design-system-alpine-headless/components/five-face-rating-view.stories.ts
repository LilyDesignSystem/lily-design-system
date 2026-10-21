import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"five-face-rating-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Five Face Rating View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

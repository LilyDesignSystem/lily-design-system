import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"red-amber-green-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Red Amber Green View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

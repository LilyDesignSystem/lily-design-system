import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span\n  class=\"net-promoter-score-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Net Promoter Score View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

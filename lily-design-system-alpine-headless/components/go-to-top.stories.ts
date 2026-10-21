import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<a\n  class=\"go-to-top\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</a>";

const meta = {
  title: 'Headless/Go To Top',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

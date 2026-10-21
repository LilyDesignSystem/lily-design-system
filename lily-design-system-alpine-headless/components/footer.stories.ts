import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<footer\n  class=\"footer\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</footer>";

const meta = {
  title: 'Headless/Footer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

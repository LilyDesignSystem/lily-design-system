import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"hidden-input\"\n  aria-label=\"Example\"\n>\n  <!-- Consumer provides content -->\n</input>";

const meta = {
  title: 'Headless/Hidden Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

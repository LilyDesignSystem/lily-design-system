import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<label\n  class=\"label\"\n  aria-label=\"Example\"\n>\n  <!-- Consumer provides content -->\n</label>";

const meta = {
  title: 'Headless/Label',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

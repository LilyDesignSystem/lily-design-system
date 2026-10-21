import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<code\n  class=\"code\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</code>";

const meta = {
  title: 'Headless/Code',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

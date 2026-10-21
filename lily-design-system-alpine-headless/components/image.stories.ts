import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<img\n  class=\"image\"\n  aria-label=\"Example\"\n>\n  <!-- Consumer provides content -->\n</img>";

const meta = {
  title: 'Headless/Image',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

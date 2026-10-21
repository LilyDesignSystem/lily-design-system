import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"image-input\"\n  type=\"image\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Image Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

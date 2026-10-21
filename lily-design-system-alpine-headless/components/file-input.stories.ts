import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"file-input\"\n  type=\"file\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/File Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

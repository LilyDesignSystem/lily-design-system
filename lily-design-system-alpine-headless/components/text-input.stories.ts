import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"text-input\"\n  type=\"text\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Text Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

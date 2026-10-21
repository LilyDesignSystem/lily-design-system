import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"month-input\"\n  type=\"month\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Month Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

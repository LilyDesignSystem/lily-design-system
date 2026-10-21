import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"password-input\"\n  type=\"password\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Password Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

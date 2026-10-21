import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"tel-input\"\n  type=\"tel\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Tel Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

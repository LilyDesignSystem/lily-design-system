import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"range-input\"\n  type=\"range\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Range Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"color-input\"\n  type=\"color\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Color Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

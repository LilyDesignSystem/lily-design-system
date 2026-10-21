import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"number-input\"\n  type=\"number\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Number Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

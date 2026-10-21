import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"week-input\"\n  type=\"week\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Week Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

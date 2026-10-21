import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"time-input\"\n  type=\"time\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Time Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

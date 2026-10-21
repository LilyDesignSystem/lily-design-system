import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<time class=\"timer\" role=\"timer\" aria-label=\"\" datetime=\"\">\n  <!-- Consumer provides the formatted time -->\n</time>";

const meta = {
  title: 'Headless/Timer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

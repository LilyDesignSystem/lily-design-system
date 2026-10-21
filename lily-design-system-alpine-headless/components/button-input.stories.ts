import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"button-input\"\n  type=\"button\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Button Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

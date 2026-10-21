import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"radio-input\"\n  type=\"radio\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Radio Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

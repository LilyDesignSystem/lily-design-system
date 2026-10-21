import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"checkbox-input\"\n  type=\"checkbox\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Checkbox Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"date-input\"\n  type=\"date\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Date Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

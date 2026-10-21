import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"date-time-local-input\"\n  type=\"datetime-local\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Date Time Local Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<input\n  class=\"search-input\"\n  role=\"searchbox\"\n  type=\"search\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Search Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

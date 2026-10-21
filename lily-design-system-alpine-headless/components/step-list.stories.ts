import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<ol\n  class=\"step-list\"\n  aria-label=\"\"\n  data-current=\"\"\n>\n  <!-- Consumer provides one or more <li class=\"step-list-item\"> children -->\n</ol>";

const meta = {
  title: 'Headless/Step List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

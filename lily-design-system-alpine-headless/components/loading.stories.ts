import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"loading\"\n  role=\"status\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides loading indicator (text, spinner, animation) -->\n</div>";

const meta = {
  title: 'Headless/Loading',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

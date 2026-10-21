import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<button\n  class=\"button\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

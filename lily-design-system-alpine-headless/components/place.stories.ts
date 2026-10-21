import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<article\n  class=\"place\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</article>";

const meta = {
  title: 'Headless/Place',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<section\n  class=\"hero\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</section>";

const meta = {
  title: 'Headless/Hero',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<header\n  class=\"header\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</header>";

const meta = {
  title: 'Headless/Header',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

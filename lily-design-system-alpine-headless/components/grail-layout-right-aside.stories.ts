import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<aside\n  class=\"grail-layout-right-aside\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</aside>";

const meta = {
  title: 'Headless/Grail Layout Right Aside',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

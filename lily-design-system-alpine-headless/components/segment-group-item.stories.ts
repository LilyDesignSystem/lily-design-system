import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<button\n  class=\"segment-group-item\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Segment Group Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

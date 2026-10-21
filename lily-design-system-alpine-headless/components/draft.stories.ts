import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"draft\"\n  aria-label=\"\"\n  data-status=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Draft',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

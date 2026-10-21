import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"content-block\"\n  aria-label=\"\"\n  data-width=\"normal\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Content Block',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

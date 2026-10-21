import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"visible\"\n  aria-label=\"\"\n  data-visible=\"false\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Visible',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

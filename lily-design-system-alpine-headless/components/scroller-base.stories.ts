import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"scroller-base\"\n  aria-label=\"\"\n  data-offset=\"0.5\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Scroller Base',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

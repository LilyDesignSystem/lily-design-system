import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"horizontal-scroller\"\n  role=\"region\"\n  aria-label=\"\"\n  tabindex=\"0\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Horizontal Scroller',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

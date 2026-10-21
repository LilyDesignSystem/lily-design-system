import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"resizable\" role=\"region\" tabindex=\"0\" aria-label=\"\" data-resize=\"both\">\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Resizable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

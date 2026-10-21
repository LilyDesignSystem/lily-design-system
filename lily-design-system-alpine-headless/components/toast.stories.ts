import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"toast\" role=\"status\" aria-live=\"polite\" aria-label=\"\">\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Toast',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"notification\"\n  role=\"alert\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Notification',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

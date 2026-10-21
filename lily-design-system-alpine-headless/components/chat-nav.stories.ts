import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<nav\n  class=\"chat-nav\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</nav>";

const meta = {
  title: 'Headless/Chat Nav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

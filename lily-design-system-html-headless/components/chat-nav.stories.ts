import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<nav
  class="chat-nav"
  aria-label=""
>
  <!-- Consumer provides content -->
</nav>`;

const meta = {
  title: 'Headless/ChatNav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

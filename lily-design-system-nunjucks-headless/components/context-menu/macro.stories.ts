import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul
  class="context-menu"
  role="menu" hidden aria-label="Context menu"></ul>`;

const meta = {
  title: 'Headless/ContextMenu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

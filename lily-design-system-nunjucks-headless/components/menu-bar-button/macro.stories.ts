import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="menu-bar-button"
  type="button"
  role="menuitem"></button>`;

const meta = {
  title: 'Headless/MenuBarButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

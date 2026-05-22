import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="menu-bar-button"
  role="menuitem"
  aria-label=""
>
  <!-- Consumer provides button content -->
</button>`;

const meta = {
  title: 'Headless/MenuBarButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

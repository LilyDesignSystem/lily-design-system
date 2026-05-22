import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="context-menu-item"
  role="none">
  <button
    class="context-menu-item-button"
    type="button"
    role="menuitem"  >
    <span class="context-menu-item-text"></span>  </button>
</li>`;

const meta = {
  title: 'Headless/ContextMenuItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="hamburger-menu"
  type="button"
  aria-label="Menu"
  aria-expanded="false"  data-module="hamburger-menu">
  <span class="hamburger-menu-icon" aria-hidden="true"></span>
</button>`;

const meta = {
  title: 'Headless/HamburgerMenu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

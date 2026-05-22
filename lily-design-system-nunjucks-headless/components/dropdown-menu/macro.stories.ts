import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="dropdown-menu"
  role="menu"
  aria-label="Menu" hidden></div>`;

const meta = {
  title: 'Headless/DropdownMenu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="menu-bar"
  role="menubar" aria-label="Menu bar"></div>`;

const meta = {
  title: 'Headless/MenuBar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

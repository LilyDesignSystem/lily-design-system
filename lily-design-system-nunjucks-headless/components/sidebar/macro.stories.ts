import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="sidebar" aria-label="Sidebar"></aside>`;

const meta = {
  title: 'Headless/Sidebar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

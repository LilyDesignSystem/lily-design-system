import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="slide-out-drawer"
  role="dialog" aria-modal="false"
  aria-label="Drawer" hidden></div>`;

const meta = {
  title: 'Headless/SlideOutDrawer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

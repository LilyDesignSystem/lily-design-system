import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="floating-panel"
  role="dialog" aria-modal="false"
  aria-label="Panel" hidden></div>`;

const meta = {
  title: 'Headless/FloatingPanel',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

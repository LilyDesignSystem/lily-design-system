import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="sonner"
  role="region"
  aria-label="Notifications"
  aria-live="polite"></div>`;

const meta = {
  title: 'Headless/Sonner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

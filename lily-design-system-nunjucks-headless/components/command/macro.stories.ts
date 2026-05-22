import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="command"
  role="dialog"
  aria-modal="true"
  aria-label="Command palette" hidden  data-module="command"></div>`;

const meta = {
  title: 'Headless/Command',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

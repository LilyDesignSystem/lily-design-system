import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="action-group"
  role="group"></div>`;

const meta = {
  title: 'Headless/ActionGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

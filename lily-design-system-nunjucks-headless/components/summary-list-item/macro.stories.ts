import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="summary-list-item">
  <dt class="summary-list-item-key"></dt>
  <dd class="summary-list-item-value"></dd></div>`;

const meta = {
  title: 'Headless/SummaryListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

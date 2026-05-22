import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<dl
  class="summary-list"></dl>`;

const meta = {
  title: 'Headless/SummaryList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

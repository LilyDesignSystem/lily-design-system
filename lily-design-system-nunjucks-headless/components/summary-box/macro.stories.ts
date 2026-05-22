import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="summary-box">  <div class="summary-box-body"></div>
</aside>`;

const meta = {
  title: 'Headless/SummaryBox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

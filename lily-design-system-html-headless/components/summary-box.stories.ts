import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="summary-box"
  aria-label=""
>
  <h3 class="summary-box-heading">
    <!-- Consumer-provided heading text -->
  </h3>
  <div class="summary-box-body">
    <!-- Consumer-provided body content -->
  </div>
</aside>`;

const meta = {
  title: 'Headless/SummaryBox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

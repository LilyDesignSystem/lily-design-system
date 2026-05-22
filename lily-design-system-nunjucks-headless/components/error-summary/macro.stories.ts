import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="error-summary"
  role="alert"
  tabindex="-1"
  aria-labelledby="error-summary-title">
  <h2 class="error-summary-title" id="error-summary-title">There is a problem</h2>
  <div class="error-summary-body">  </div>
</div>`;

const meta = {
  title: 'Headless/ErrorSummary',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<svg
  class="sparkline"
  role="img"
  viewBox="0 0 80 24"
  width="80"
  height="24"
  aria-label="Trend chart"  xmlns="http://www.w3.org/2000/svg"
>
  <polyline fill="none" stroke="currentColor" stroke-width="1.5" points="0,24"/>
</svg>`;

const meta = {
  title: 'Headless/Sparkline',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

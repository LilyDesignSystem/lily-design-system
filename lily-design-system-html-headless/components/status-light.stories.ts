import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="status-light"
  data-variant="neutral"
  role="status"
>
  <span class="status-light-dot" aria-hidden="true"></span>
  <span class="status-light-label"></span>
</span>`;

const meta = {
  title: 'Headless/StatusLight',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

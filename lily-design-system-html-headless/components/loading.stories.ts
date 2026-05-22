import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="loading"
  role="status"
  aria-label=""
>
  <!-- Consumer provides loading indicator (text, spinner, animation) -->
</div>`;

const meta = {
  title: 'Headless/Loading',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

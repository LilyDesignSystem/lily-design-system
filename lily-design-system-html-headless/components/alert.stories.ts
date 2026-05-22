import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="alert"
  role="alert"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/Alert',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

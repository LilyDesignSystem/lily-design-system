import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="grid"
  data-columns="12"
  style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 1rem;"
>
  <!-- Consumer provides grid items -->
</div>`;

const meta = {
  title: 'Headless/Grid',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

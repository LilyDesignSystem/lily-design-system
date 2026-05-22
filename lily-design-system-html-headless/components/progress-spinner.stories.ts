import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="progress-spinner"
  role="progressbar"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/ProgressSpinner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

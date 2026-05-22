import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="flex-stack"
  data-direction="column"
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <!-- Consumer provides stacked children -->
</div>`;

const meta = {
  title: 'Headless/FlexStack',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

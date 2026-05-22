import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="button-group"
  role="group"
  aria-label=""
>
  <!-- Consumer provides related <button> elements as children -->
</div>`;

const meta = {
  title: 'Headless/ButtonGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

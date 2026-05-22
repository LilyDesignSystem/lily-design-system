import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="red-amber-green-picker-button"
  role="radio"
  aria-label=""
>
  <!-- Consumer provides button content -->
</button>`;

const meta = {
  title: 'Headless/RedAmberGreenPickerButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="color-picker-button"
  role="radio"
  aria-label=""
>
  <!-- Consumer provides button content -->
</button>`;

const meta = {
  title: 'Headless/ColorPickerButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

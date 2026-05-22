import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="red-amber-green-picker-button"
  type="button"
  role="radio"
  aria-checked="false"
  tabindex="-1"
  data-status=""></button>`;

const meta = {
  title: 'Headless/RedAmberGreenPickerButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

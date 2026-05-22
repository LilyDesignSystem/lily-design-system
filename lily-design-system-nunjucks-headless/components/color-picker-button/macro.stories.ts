import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="color-picker-button"
  type="button"
  role="radio"
  aria-checked="false"
  tabindex="-1"
  aria-label=""
  style="background: "
  data-color=""></button>`;

const meta = {
  title: 'Headless/ColorPickerButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

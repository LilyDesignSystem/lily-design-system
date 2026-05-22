import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="red-orange-yellow-green-blue-picker-button"
  type="button"
  role="radio"
  aria-checked="false"
  tabindex="-1"
  data-status=""></button>`;

const meta = {
  title: 'Headless/RedOrangeYellowGreenBluePickerButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

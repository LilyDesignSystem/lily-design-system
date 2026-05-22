import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="northern-ireland-health-and-care-number-input"
  type="text"
  id=""
  name=""
  value=""
  inputmode="numeric"
  pattern="[0-9 \\-]{10,13}"
  maxlength="13"
  autocomplete="off"
  spellcheck="false">`;

const meta = {
  title: 'Headless/NorthernIrelandHealthAndCareNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

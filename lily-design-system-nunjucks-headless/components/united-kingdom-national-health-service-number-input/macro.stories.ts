import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="united-kingdom-national-health-service-number-input"
  type="text"
  id=""
  name=""
  value=""
  inputmode="numeric"
  pattern="[0-9 \\-]{10,13}"
  autocomplete="off"
  spellcheck="false">`;

const meta = {
  title: 'Headless/UnitedKingdomNationalHealthServiceNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="united-kingdom-national-insurance-number-input"
  type="text"
  aria-label="National Insurance Number"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/UnitedKingdomNationalInsuranceNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

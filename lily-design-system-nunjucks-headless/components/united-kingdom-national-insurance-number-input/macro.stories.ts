import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="united-kingdom-national-insurance-number-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="National Insurance Number">`;

const meta = {
  title: 'Headless/UnitedKingdomNationalInsuranceNumberInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

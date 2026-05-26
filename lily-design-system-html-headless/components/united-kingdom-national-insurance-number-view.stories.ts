import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="united-kingdom-national-insurance-number-view"
  aria-label="National Insurance Number"
>sample-value</span>`;

const meta = {
  title: 'Headless/UnitedKingdomNationalInsuranceNumberView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

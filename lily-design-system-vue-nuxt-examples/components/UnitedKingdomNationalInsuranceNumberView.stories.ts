import type { Meta, StoryObj } from '@storybook/vue3-vite';
import UnitedKingdomNationalInsuranceNumberView from './UnitedKingdomNationalInsuranceNumberView.vue';

const meta = {
  title: 'Headless/UnitedKingdomNationalInsuranceNumberView',
  component: UnitedKingdomNationalInsuranceNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedKingdomNationalInsuranceNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'UnitedKingdomNationalInsuranceNumberView' }
};

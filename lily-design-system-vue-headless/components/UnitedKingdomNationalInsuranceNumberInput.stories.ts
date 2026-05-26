import type { Meta, StoryObj } from '@storybook/vue3-vite';
import UnitedKingdomNationalInsuranceNumberInput from './UnitedKingdomNationalInsuranceNumberInput.vue';

const meta = {
  title: 'Headless/UnitedKingdomNationalInsuranceNumberInput',
  component: UnitedKingdomNationalInsuranceNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedKingdomNationalInsuranceNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'UnitedKingdomNationalInsuranceNumberInput' }
};

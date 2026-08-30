import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import UnitedKingdomNationalInsuranceNumberInput from './UnitedKingdomNationalInsuranceNumberInput';

const meta = {
  title: 'Examples/UnitedKingdomNationalInsuranceNumberInput',
  component: UnitedKingdomNationalInsuranceNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedKingdomNationalInsuranceNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'UnitedKingdomNationalInsuranceNumberInput' }
};

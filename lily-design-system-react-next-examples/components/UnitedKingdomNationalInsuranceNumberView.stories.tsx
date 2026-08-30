import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import UnitedKingdomNationalInsuranceNumberView from './UnitedKingdomNationalInsuranceNumberView';

const meta = {
  title: 'Examples/UnitedKingdomNationalInsuranceNumberView',
  component: UnitedKingdomNationalInsuranceNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedKingdomNationalInsuranceNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'UnitedKingdomNationalInsuranceNumberView' }
};

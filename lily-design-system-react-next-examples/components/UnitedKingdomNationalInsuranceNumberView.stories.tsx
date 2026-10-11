import type { Meta, StoryObj } from '@storybook/react-vite';
import UnitedKingdomNationalInsuranceNumberView from './UnitedKingdomNationalInsuranceNumberView';

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

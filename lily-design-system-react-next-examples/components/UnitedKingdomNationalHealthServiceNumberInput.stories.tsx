import type { Meta, StoryObj } from '@storybook/react-vite';
import UnitedKingdomNationalHealthServiceNumberInput from './UnitedKingdomNationalHealthServiceNumberInput';

const meta = {
  title: 'Headless/UnitedKingdomNationalHealthServiceNumberInput',
  component: UnitedKingdomNationalHealthServiceNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedKingdomNationalHealthServiceNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

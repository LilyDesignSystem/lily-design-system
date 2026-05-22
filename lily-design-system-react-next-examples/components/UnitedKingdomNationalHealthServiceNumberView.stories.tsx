import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import UnitedKingdomNationalHealthServiceNumberView from './UnitedKingdomNationalHealthServiceNumberView';

const meta = {
  title: 'Examples/UnitedKingdomNationalHealthServiceNumberView',
  component: UnitedKingdomNationalHealthServiceNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedKingdomNationalHealthServiceNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

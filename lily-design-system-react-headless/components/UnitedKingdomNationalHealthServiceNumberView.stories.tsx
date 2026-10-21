import type { Meta, StoryObj } from '@storybook/react-vite';
import UnitedKingdomNationalHealthServiceNumberView from './UnitedKingdomNationalHealthServiceNumberView';

const meta = {
  title: 'Headless/UnitedKingdomNationalHealthServiceNumberView',
  component: UnitedKingdomNationalHealthServiceNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedKingdomNationalHealthServiceNumberView>;

export default meta;
type Story = StoryObj<typeof UnitedKingdomNationalHealthServiceNumberView>;

export const Default: Story = {};

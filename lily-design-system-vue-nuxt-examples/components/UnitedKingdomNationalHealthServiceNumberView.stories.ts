import type { Meta, StoryObj } from '@storybook/vue3-vite';
import UnitedKingdomNationalHealthServiceNumberView from './UnitedKingdomNationalHealthServiceNumberView.vue';

const meta = {
  title: 'Headless/UnitedKingdomNationalHealthServiceNumberView',
  component: UnitedKingdomNationalHealthServiceNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedKingdomNationalHealthServiceNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

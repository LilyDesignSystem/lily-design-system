import type { Meta, StoryObj } from '@storybook/vue3-vite';
import UnitedKingdomNationalHealthServiceNumberInput from './UnitedKingdomNationalHealthServiceNumberInput.vue';

const meta = {
  title: 'Headless/UnitedKingdomNationalHealthServiceNumberInput',
  component: UnitedKingdomNationalHealthServiceNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedKingdomNationalHealthServiceNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

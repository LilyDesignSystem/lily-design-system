import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CurrencyInput from './CurrencyInput.vue';

const meta = {
  title: 'Headless/CurrencyInput',
  component: CurrencyInput,
  tags: ['autodocs']
} satisfies Meta<typeof CurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

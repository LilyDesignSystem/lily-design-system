import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CurrencyInput from './CurrencyInput';

const meta = {
  title: 'Examples/CurrencyInput',
  component: CurrencyInput,
  tags: ['autodocs']
} satisfies Meta<typeof CurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-vite';
import CurrencyInput from './CurrencyInput';

const meta = {
  title: 'Headless/CurrencyInput',
  component: CurrencyInput,
  tags: ['autodocs']
} satisfies Meta<typeof CurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

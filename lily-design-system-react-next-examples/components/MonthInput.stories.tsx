import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MonthInput from './MonthInput';

const meta = {
  title: 'Examples/MonthInput',
  component: MonthInput,
  tags: ['autodocs']
} satisfies Meta<typeof MonthInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

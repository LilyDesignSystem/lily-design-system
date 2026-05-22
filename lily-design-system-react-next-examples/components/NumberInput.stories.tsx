import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NumberInput from './NumberInput';

const meta = {
  title: 'Examples/NumberInput',
  component: NumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

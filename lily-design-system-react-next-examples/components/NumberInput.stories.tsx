import type { Meta, StoryObj } from '@storybook/react-vite';
import NumberInput from './NumberInput';

const meta = {
  title: 'Headless/NumberInput',
  component: NumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SlovenijaEmsoInput from './SlovenijaEmsoInput';

const meta = {
  title: 'Examples/SlovenijaEmsoInput',
  component: SlovenijaEmsoInput,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenijaEmsoInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenijaEmsoInput' }
};

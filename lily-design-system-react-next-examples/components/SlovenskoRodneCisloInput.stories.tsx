import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SlovenskoRodneCisloInput from './SlovenskoRodneCisloInput';

const meta = {
  title: 'Examples/SlovenskoRodneCisloInput',
  component: SlovenskoRodneCisloInput,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenskoRodneCisloInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenskoRodneCisloInput' }
};

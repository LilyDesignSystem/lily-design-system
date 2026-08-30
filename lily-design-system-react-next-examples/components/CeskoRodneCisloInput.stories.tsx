import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CeskoRodneCisloInput from './CeskoRodneCisloInput';

const meta = {
  title: 'Examples/CeskoRodneCisloInput',
  component: CeskoRodneCisloInput,
  tags: ['autodocs']
} satisfies Meta<typeof CeskoRodneCisloInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CeskoRodneCisloInput' }
};

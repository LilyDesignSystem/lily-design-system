import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DanmarkPersonnummerInput from './DanmarkPersonnummerInput';

const meta = {
  title: 'Examples/DanmarkPersonnummerInput',
  component: DanmarkPersonnummerInput,
  tags: ['autodocs']
} satisfies Meta<typeof DanmarkPersonnummerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'DanmarkPersonnummerInput' }
};

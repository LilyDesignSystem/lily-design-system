import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PolskaPeselInput from './PolskaPeselInput';

const meta = {
  title: 'Examples/PolskaPeselInput',
  component: PolskaPeselInput,
  tags: ['autodocs']
} satisfies Meta<typeof PolskaPeselInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PolskaPeselInput' }
};

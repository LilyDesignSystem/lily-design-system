import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SlovenskoPasInput from './SlovenskoPasInput';

const meta = {
  title: 'Examples/SlovenskoPasInput',
  component: SlovenskoPasInput,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenskoPasInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenskoPasInput' }
};

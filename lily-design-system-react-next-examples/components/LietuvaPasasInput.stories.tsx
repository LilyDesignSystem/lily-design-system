import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LietuvaPasasInput from './LietuvaPasasInput';

const meta = {
  title: 'Examples/LietuvaPasasInput',
  component: LietuvaPasasInput,
  tags: ['autodocs']
} satisfies Meta<typeof LietuvaPasasInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LietuvaPasasInput' }
};

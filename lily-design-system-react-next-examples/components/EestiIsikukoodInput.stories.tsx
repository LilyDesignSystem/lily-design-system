import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EestiIsikukoodInput from './EestiIsikukoodInput';

const meta = {
  title: 'Examples/EestiIsikukoodInput',
  component: EestiIsikukoodInput,
  tags: ['autodocs']
} satisfies Meta<typeof EestiIsikukoodInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EestiIsikukoodInput' }
};

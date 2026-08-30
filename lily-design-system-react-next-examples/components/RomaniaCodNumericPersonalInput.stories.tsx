import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RomaniaCodNumericPersonalInput from './RomaniaCodNumericPersonalInput';

const meta = {
  title: 'Examples/RomaniaCodNumericPersonalInput',
  component: RomaniaCodNumericPersonalInput,
  tags: ['autodocs']
} satisfies Meta<typeof RomaniaCodNumericPersonalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'RomaniaCodNumericPersonalInput' }
};

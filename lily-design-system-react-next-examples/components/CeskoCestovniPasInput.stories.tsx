import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CeskoCestovniPasInput from './CeskoCestovniPasInput';

const meta = {
  title: 'Examples/CeskoCestovniPasInput',
  component: CeskoCestovniPasInput,
  tags: ['autodocs']
} satisfies Meta<typeof CeskoCestovniPasInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CeskoCestovniPasInput' }
};

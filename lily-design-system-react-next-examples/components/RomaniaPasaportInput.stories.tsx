import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RomaniaPasaportInput from './RomaniaPasaportInput';

const meta = {
  title: 'Examples/RomaniaPasaportInput',
  component: RomaniaPasaportInput,
  tags: ['autodocs']
} satisfies Meta<typeof RomaniaPasaportInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'RomaniaPasaportInput' }
};

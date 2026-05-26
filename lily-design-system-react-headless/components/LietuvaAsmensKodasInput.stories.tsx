import type { Meta, StoryObj } from '@storybook/react-vite';
import LietuvaAsmensKodasInput from './LietuvaAsmensKodasInput';

const meta = {
  title: 'Headless/LietuvaAsmensKodasInput',
  component: LietuvaAsmensKodasInput,
  tags: ['autodocs']
} satisfies Meta<typeof LietuvaAsmensKodasInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LietuvaAsmensKodasInput' }
};

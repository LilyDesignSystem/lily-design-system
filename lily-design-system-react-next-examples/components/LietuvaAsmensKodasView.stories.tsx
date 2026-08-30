import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LietuvaAsmensKodasView from './LietuvaAsmensKodasView';

const meta = {
  title: 'Examples/LietuvaAsmensKodasView',
  component: LietuvaAsmensKodasView,
  tags: ['autodocs']
} satisfies Meta<typeof LietuvaAsmensKodasView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LietuvaAsmensKodasView' }
};

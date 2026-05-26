import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LietuvaAsmensKodasView from './LietuvaAsmensKodasView.vue';

const meta = {
  title: 'Headless/LietuvaAsmensKodasView',
  component: LietuvaAsmensKodasView,
  tags: ['autodocs']
} satisfies Meta<typeof LietuvaAsmensKodasView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LietuvaAsmensKodasView' }
};

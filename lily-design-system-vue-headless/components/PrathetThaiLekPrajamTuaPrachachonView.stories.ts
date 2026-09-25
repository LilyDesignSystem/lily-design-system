import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PrathetThaiLekPrajamTuaPrachachonView from './PrathetThaiLekPrajamTuaPrachachonView.vue';

const meta = {
  title: 'Headless/PrathetThaiLekPrajamTuaPrachachonView',
  component: PrathetThaiLekPrajamTuaPrachachonView,
  tags: ['autodocs']
} satisfies Meta<typeof PrathetThaiLekPrajamTuaPrachachonView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PrathetThaiLekPrajamTuaPrachachonView' }
};

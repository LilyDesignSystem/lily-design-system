import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NetPromoterScorePicker from './NetPromoterScorePicker.vue';

const meta = {
  title: 'Examples/NetPromoterScorePicker',
  component: NetPromoterScorePicker,
  tags: ['autodocs']
} satisfies Meta<typeof NetPromoterScorePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

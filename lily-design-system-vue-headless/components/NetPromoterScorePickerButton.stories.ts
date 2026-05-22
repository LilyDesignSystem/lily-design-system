import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NetPromoterScorePickerButton from './NetPromoterScorePickerButton.vue';

const meta = {
  title: 'Headless/NetPromoterScorePickerButton',
  component: NetPromoterScorePickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof NetPromoterScorePickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

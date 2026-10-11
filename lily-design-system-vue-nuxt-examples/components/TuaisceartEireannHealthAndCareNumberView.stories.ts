import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TuaisceartEireannHealthAndCareNumberView from './TuaisceartEireannHealthAndCareNumberView.vue';

const meta = {
  title: 'Headless/TuaisceartEireannHealthAndCareNumberView',
  component: TuaisceartEireannHealthAndCareNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof TuaisceartEireannHealthAndCareNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Statistic from './Statistic.vue';

const meta = {
  title: 'Examples/Statistic',
  component: Statistic,
  tags: ['autodocs']
} satisfies Meta<typeof Statistic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

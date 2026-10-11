import type { Meta, StoryObj } from '@storybook/vue3-vite';
import RedAmberGreenView from './RedAmberGreenView.vue';

const meta = {
  title: 'Headless/RedAmberGreenView',
  component: RedAmberGreenView,
  tags: ['autodocs']
} satisfies Meta<typeof RedAmberGreenView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

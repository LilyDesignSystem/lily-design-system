import type { Meta, StoryObj } from '@storybook/vue3-vite';
import StepList from './StepList.vue';

const meta = {
  title: 'Headless/StepList',
  component: StepList,
  tags: ['autodocs']
} satisfies Meta<typeof StepList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

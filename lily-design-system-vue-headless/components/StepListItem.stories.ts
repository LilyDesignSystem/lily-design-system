import type { Meta, StoryObj } from '@storybook/vue3-vite';
import StepListItem from './StepListItem.vue';

const meta = {
  title: 'Headless/StepListItem',
  component: StepListItem,
  tags: ['autodocs']
} satisfies Meta<typeof StepListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

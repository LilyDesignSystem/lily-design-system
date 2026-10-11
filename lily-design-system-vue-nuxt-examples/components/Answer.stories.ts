import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Answer from './Answer.vue';

const meta = {
  title: 'Headless/Answer',
  component: Answer,
  tags: ['autodocs']
} satisfies Meta<typeof Answer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Question from './Question.vue';

const meta = {
  title: 'Examples/Question',
  component: Question,
  tags: ['autodocs']
} satisfies Meta<typeof Question>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

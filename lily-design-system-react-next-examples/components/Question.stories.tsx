import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Question from './Question';

const meta = {
  title: 'Examples/Question',
  component: Question,
  tags: ['autodocs']
} satisfies Meta<typeof Question>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

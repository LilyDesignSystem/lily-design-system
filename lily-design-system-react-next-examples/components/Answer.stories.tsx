import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Answer from './Answer';

const meta = {
  title: 'Examples/Answer',
  component: Answer,
  tags: ['autodocs']
} satisfies Meta<typeof Answer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

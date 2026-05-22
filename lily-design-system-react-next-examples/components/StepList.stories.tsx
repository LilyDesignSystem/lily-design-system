import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import StepList from './StepList';

const meta = {
  title: 'Examples/StepList',
  component: StepList,
  tags: ['autodocs']
} satisfies Meta<typeof StepList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

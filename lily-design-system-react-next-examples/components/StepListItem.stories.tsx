import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import StepListItem from './StepListItem';

const meta = {
  title: 'Examples/StepListItem',
  component: StepListItem,
  tags: ['autodocs']
} satisfies Meta<typeof StepListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

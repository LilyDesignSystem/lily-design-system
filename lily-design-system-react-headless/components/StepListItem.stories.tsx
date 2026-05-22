import type { Meta, StoryObj } from '@storybook/react-vite';
import StepListItem from './StepListItem';

const meta = {
  title: 'Headless/StepListItem',
  component: StepListItem,
  tags: ['autodocs']
} satisfies Meta<typeof StepListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

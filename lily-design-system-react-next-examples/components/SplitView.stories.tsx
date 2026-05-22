import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SplitView from './SplitView';

const meta = {
  title: 'Examples/SplitView',
  component: SplitView,
  tags: ['autodocs']
} satisfies Meta<typeof SplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

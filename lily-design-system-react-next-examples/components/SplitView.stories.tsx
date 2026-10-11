import type { Meta, StoryObj } from '@storybook/react-vite';
import SplitView from './SplitView';

const meta = {
  title: 'Headless/SplitView',
  component: SplitView,
  tags: ['autodocs']
} satisfies Meta<typeof SplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

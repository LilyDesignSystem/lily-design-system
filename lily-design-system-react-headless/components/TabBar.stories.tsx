import type { Meta, StoryObj } from '@storybook/react-vite';
import TabBar from './TabBar';

const meta = {
  title: 'Headless/TabBar',
  component: TabBar,
  tags: ['autodocs']
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

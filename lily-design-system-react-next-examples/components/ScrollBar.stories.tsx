import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ScrollBar from './ScrollBar';

const meta = {
  title: 'Examples/ScrollBar',
  component: ScrollBar,
  tags: ['autodocs']
} satisfies Meta<typeof ScrollBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

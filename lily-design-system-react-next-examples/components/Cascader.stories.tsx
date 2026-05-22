import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Cascader from './Cascader';

const meta = {
  title: 'Examples/Cascader',
  component: Cascader,
  tags: ['autodocs']
} satisfies Meta<typeof Cascader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

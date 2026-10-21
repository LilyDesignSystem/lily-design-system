import type { Meta, StoryObj } from '@storybook/react-vite';
import Cascader from './Cascader';

const meta = {
  title: 'Headless/Cascader',
  component: Cascader,
  tags: ['autodocs']
} satisfies Meta<typeof Cascader>;

export default meta;
type Story = StoryObj<typeof Cascader>;

export const Default: Story = {};

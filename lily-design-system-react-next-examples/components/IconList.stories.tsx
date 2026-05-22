import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import IconList from './IconList';

const meta = {
  title: 'Examples/IconList',
  component: IconList,
  tags: ['autodocs']
} satisfies Meta<typeof IconList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

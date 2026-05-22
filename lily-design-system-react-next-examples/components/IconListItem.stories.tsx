import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import IconListItem from './IconListItem';

const meta = {
  title: 'Examples/IconListItem',
  component: IconListItem,
  tags: ['autodocs']
} satisfies Meta<typeof IconListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

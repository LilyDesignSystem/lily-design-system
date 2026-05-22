import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ContentsListItem from './ContentsListItem';

const meta = {
  title: 'Examples/ContentsListItem',
  component: ContentsListItem,
  tags: ['autodocs']
} satisfies Meta<typeof ContentsListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

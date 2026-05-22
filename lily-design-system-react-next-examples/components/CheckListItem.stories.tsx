import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CheckListItem from './CheckListItem';

const meta = {
  title: 'Examples/CheckListItem',
  component: CheckListItem,
  tags: ['autodocs']
} satisfies Meta<typeof CheckListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

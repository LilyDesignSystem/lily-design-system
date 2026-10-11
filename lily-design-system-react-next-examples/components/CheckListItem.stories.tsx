import type { Meta, StoryObj } from '@storybook/react-vite';
import CheckListItem from './CheckListItem';

const meta = {
  title: 'Headless/CheckListItem',
  component: CheckListItem,
  tags: ['autodocs']
} satisfies Meta<typeof CheckListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

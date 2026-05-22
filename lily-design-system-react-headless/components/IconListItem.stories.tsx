import type { Meta, StoryObj } from '@storybook/react-vite';
import IconListItem from './IconListItem';

const meta = {
  title: 'Headless/IconListItem',
  component: IconListItem,
  tags: ['autodocs']
} satisfies Meta<typeof IconListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

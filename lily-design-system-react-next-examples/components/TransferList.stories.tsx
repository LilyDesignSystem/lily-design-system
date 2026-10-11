import type { Meta, StoryObj } from '@storybook/react-vite';
import TransferList from './TransferList';

const meta = {
  title: 'Headless/TransferList',
  component: TransferList,
  tags: ['autodocs']
} satisfies Meta<typeof TransferList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

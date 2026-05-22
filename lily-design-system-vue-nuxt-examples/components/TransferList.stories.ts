import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TransferList from './TransferList.vue';

const meta = {
  title: 'Examples/TransferList',
  component: TransferList,
  tags: ['autodocs']
} satisfies Meta<typeof TransferList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

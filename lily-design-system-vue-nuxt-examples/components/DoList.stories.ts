import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DoList from './DoList.vue';

const meta = {
  title: 'Examples/DoList',
  component: DoList,
  tags: ['autodocs']
} satisfies Meta<typeof DoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

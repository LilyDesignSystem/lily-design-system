import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TableHead from './TableHead.vue';

const meta = {
  title: 'Examples/TableHead',
  component: TableHead,
  tags: ['autodocs']
} satisfies Meta<typeof TableHead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

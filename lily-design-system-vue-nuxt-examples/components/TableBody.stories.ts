import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TableBody from './TableBody.vue';

const meta = {
  title: 'Examples/TableBody',
  component: TableBody,
  tags: ['autodocs']
} satisfies Meta<typeof TableBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

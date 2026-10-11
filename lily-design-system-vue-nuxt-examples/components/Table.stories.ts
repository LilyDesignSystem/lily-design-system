import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Table from './Table.vue';

const meta = {
  title: 'Headless/Table',
  component: Table,
  tags: ['autodocs']
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TableTH from './TableTH.vue';

const meta = {
  title: 'Headless/TableTH',
  component: TableTH,
  tags: ['autodocs']
} satisfies Meta<typeof TableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

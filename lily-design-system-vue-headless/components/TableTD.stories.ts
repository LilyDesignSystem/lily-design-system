import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TableTD from './TableTD.vue';

const meta = {
  title: 'Headless/TableTD',
  component: TableTD,
  tags: ['autodocs']
} satisfies Meta<typeof TableTD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

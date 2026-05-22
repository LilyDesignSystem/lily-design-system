import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TableFoot from './TableFoot.vue';

const meta = {
  title: 'Headless/TableFoot',
  component: TableFoot,
  tags: ['autodocs']
} satisfies Meta<typeof TableFoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DataFilterForm from './DataFilterForm.vue';

const meta = {
  title: 'Headless/DataFilterForm',
  component: DataFilterForm,
  tags: ['autodocs']
} satisfies Meta<typeof DataFilterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

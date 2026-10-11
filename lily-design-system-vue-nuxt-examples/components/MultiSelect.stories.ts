import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MultiSelect from './MultiSelect.vue';

const meta = {
  title: 'Headless/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs']
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Toppings' },
};

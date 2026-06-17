import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ThemeSelect from './ThemeSelect.vue';

const meta = {
  title: 'Examples/ThemeSelect',
  component: ThemeSelect,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MultiSelectWithExtras from './MultiSelectWithExtras.vue';

const meta = {
  title: 'Headless/MultiSelectWithExtras',
  component: MultiSelectWithExtras,
  tags: ['autodocs']
} satisfies Meta<typeof MultiSelectWithExtras>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Toppings' },
};

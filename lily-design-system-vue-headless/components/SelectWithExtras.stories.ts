import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SelectWithExtras from './SelectWithExtras.vue';

const meta = {
  title: 'Headless/SelectWithExtras',
  component: SelectWithExtras,
  tags: ['autodocs']
} satisfies Meta<typeof SelectWithExtras>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Combobox from './Combobox.vue';

const meta = {
  title: 'Headless/Combobox',
  component: Combobox,
  tags: ['autodocs']
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

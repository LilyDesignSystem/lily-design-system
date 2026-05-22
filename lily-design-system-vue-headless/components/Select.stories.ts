import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Select from './Select.vue';

const meta = {
  title: 'Headless/Select',
  component: Select,
  tags: ['autodocs']
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

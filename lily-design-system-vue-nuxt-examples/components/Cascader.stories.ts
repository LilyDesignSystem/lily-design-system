import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Cascader from './Cascader.vue';

const meta = {
  title: 'Headless/Cascader',
  component: Cascader,
  tags: ['autodocs']
} satisfies Meta<typeof Cascader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

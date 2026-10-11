import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Code from './Code.vue';

const meta = {
  title: 'Headless/Code',
  component: Code,
  tags: ['autodocs']
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

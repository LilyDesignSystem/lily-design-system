import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PaddingReset from './PaddingReset.vue';

const meta = {
  title: 'Headless/PaddingReset',
  component: PaddingReset,
  tags: ['autodocs']
} satisfies Meta<typeof PaddingReset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

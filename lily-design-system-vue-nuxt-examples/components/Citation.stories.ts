import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Citation from './Citation.vue';

const meta = {
  title: 'Examples/Citation',
  component: Citation,
  tags: ['autodocs']
} satisfies Meta<typeof Citation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MockupWatch from './MockupWatch.vue';

const meta = {
  title: 'Examples/MockupWatch',
  component: MockupWatch,
  tags: ['autodocs']
} satisfies Meta<typeof MockupWatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

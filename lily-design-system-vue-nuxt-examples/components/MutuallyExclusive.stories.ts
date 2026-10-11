import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MutuallyExclusive from './MutuallyExclusive.vue';

const meta = {
  title: 'Headless/MutuallyExclusive',
  component: MutuallyExclusive,
  tags: ['autodocs']
} satisfies Meta<typeof MutuallyExclusive>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

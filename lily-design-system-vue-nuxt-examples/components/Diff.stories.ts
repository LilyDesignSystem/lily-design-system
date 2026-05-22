import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Diff from './Diff.vue';

const meta = {
  title: 'Examples/Diff',
  component: Diff,
  tags: ['autodocs']
} satisfies Meta<typeof Diff>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

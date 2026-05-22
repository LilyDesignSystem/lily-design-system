import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TreeNav from './TreeNav.vue';

const meta = {
  title: 'Examples/TreeNav',
  component: TreeNav,
  tags: ['autodocs']
} satisfies Meta<typeof TreeNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

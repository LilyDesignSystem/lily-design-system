import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TreeMenu from './TreeMenu.vue';

const meta = {
  title: 'Headless/TreeMenu',
  component: TreeMenu,
  tags: ['autodocs']
} satisfies Meta<typeof TreeMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TreeLink from './TreeLink.vue';

const meta = {
  title: 'Headless/TreeLink',
  component: TreeLink,
  tags: ['autodocs']
} satisfies Meta<typeof TreeLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

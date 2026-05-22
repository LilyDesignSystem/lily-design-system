import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CheckList from './CheckList.vue';

const meta = {
  title: 'Headless/CheckList',
  component: CheckList,
  tags: ['autodocs']
} satisfies Meta<typeof CheckList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

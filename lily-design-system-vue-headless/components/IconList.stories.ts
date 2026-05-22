import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IconList from './IconList.vue';

const meta = {
  title: 'Headless/IconList',
  component: IconList,
  tags: ['autodocs']
} satisfies Meta<typeof IconList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

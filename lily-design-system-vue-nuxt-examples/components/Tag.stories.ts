import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Tag from './Tag.vue';

const meta = {
  title: 'Examples/Tag',
  component: Tag,
  tags: ['autodocs']
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

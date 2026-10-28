import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Picture from './Picture.vue';

const meta = {
  title: 'Headless/Picture',
  component: Picture,
  tags: ['autodocs']
} satisfies Meta<typeof Picture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

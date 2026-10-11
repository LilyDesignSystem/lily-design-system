import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Tour from './Tour.vue';

const meta = {
  title: 'Headless/Tour',
  component: Tour,
  tags: ['autodocs']
} satisfies Meta<typeof Tour>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

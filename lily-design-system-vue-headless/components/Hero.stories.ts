import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Hero from './Hero.vue';

const meta = {
  title: 'Headless/Hero',
  component: Hero,
  tags: ['autodocs']
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

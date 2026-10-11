import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Carousel from './Carousel.vue';

const meta = {
  title: 'Headless/Carousel',
  component: Carousel,
  tags: ['autodocs']
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

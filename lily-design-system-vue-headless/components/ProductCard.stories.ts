import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ProductCard from './ProductCard.vue';

const meta = {
  title: 'Headless/ProductCard',
  component: ProductCard,
  tags: ['autodocs']
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

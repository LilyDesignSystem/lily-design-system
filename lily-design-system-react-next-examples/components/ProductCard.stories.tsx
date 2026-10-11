import type { Meta, StoryObj } from '@storybook/react-vite';
import ProductCard from './ProductCard';

const meta = {
  title: 'Headless/ProductCard',
  component: ProductCard,
  tags: ['autodocs']
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

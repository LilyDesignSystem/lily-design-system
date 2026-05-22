import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Carousel from './Carousel';

const meta = {
  title: 'Examples/Carousel',
  component: Carousel,
  tags: ['autodocs']
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

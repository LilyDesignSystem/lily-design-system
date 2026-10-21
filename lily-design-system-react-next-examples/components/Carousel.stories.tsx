import type { Meta, StoryObj } from '@storybook/react-vite';
import Carousel from './Carousel';

const meta = {
  title: 'Headless/Carousel',
  component: Carousel,
  tags: ['autodocs']
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Masonry from './Masonry';

const meta = {
  title: 'Examples/Masonry',
  component: Masonry,
  tags: ['autodocs']
} satisfies Meta<typeof Masonry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

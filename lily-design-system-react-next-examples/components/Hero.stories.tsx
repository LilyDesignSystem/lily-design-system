import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Hero from './Hero';

const meta = {
  title: 'Examples/Hero',
  component: Hero,
  tags: ['autodocs']
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

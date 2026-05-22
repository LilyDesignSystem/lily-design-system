import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Card from './Card';

const meta = {
  title: 'Examples/Card',
  component: Card,
  tags: ['autodocs']
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Tour from './Tour';

const meta = {
  title: 'Examples/Tour',
  component: Tour,
  tags: ['autodocs']
} satisfies Meta<typeof Tour>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

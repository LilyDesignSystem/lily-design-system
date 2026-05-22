import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Citation from './Citation';

const meta = {
  title: 'Examples/Citation',
  component: Citation,
  tags: ['autodocs']
} satisfies Meta<typeof Citation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

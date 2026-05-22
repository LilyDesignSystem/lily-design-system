import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Code from './Code';

const meta = {
  title: 'Examples/Code',
  component: Code,
  tags: ['autodocs']
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

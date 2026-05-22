import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MockupLaptop from './MockupLaptop';

const meta = {
  title: 'Examples/MockupLaptop',
  component: MockupLaptop,
  tags: ['autodocs']
} satisfies Meta<typeof MockupLaptop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

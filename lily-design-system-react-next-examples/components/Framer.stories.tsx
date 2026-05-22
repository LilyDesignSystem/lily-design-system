import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Framer from './Framer';

const meta = {
  title: 'Examples/Framer',
  component: Framer,
  tags: ['autodocs']
} satisfies Meta<typeof Framer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Kbd from './Kbd';

const meta = {
  title: 'Examples/Kbd',
  component: Kbd,
  tags: ['autodocs']
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

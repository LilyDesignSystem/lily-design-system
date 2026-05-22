import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Command from './Command';

const meta = {
  title: 'Examples/Command',
  component: Command,
  tags: ['autodocs']
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

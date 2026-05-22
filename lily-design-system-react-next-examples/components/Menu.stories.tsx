import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Menu from './Menu';

const meta = {
  title: 'Examples/Menu',
  component: Menu,
  tags: ['autodocs']
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

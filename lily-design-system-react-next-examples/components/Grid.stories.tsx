import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Grid from './Grid';

const meta = {
  title: 'Examples/Grid',
  component: Grid,
  tags: ['autodocs']
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

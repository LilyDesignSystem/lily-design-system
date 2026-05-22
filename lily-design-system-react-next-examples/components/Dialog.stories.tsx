import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Dialog from './Dialog';

const meta = {
  title: 'Examples/Dialog',
  component: Dialog,
  tags: ['autodocs']
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AlertDialog from './AlertDialog';

const meta = {
  title: 'Examples/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs']
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

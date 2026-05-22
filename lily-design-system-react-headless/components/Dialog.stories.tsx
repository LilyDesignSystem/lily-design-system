import type { Meta, StoryObj } from '@storybook/react-vite';
import Dialog from './Dialog';

const meta = {
  title: 'Headless/Dialog',
  component: Dialog,
  tags: ['autodocs']
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

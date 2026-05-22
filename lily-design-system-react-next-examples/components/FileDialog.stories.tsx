import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FileDialog from './FileDialog';

const meta = {
  title: 'Examples/FileDialog',
  component: FileDialog,
  tags: ['autodocs']
} satisfies Meta<typeof FileDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

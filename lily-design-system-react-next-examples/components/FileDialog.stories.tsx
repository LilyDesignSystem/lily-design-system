import type { Meta, StoryObj } from '@storybook/react-vite';
import FileDialog from './FileDialog';

const meta = {
  title: 'Headless/FileDialog',
  component: FileDialog,
  tags: ['autodocs']
} satisfies Meta<typeof FileDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

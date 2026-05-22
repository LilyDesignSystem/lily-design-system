import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FileUpload from './FileUpload';

const meta = {
  title: 'Examples/FileUpload',
  component: FileUpload,
  tags: ['autodocs']
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

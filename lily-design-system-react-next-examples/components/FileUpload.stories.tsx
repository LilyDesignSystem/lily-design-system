import type { Meta, StoryObj } from '@storybook/react-vite';
import FileUpload from './FileUpload';

const meta = {
  title: 'Headless/FileUpload',
  component: FileUpload,
  tags: ['autodocs']
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

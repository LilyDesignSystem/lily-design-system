import type { Meta, StoryObj } from '@storybook/react-vite';
import ImageFileInput from './ImageFileInput';

const meta = {
  title: 'Headless/ImageFileInput',
  component: ImageFileInput,
  tags: ['autodocs']
} satisfies Meta<typeof ImageFileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

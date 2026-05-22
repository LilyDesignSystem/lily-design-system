import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ImageInput from './ImageInput';

const meta = {
  title: 'Examples/ImageInput',
  component: ImageInput,
  tags: ['autodocs']
} satisfies Meta<typeof ImageInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

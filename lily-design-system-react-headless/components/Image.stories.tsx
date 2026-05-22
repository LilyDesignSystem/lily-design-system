import type { Meta, StoryObj } from '@storybook/react-vite';
import Image from './Image';

const meta = {
  title: 'Headless/Image',
  component: Image,
  tags: ['autodocs']
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

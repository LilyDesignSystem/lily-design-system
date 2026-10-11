import type { Meta, StoryObj } from '@storybook/react-vite';
import Masonry from './Masonry';

const meta = {
  title: 'Headless/Masonry',
  component: Masonry,
  tags: ['autodocs']
} satisfies Meta<typeof Masonry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

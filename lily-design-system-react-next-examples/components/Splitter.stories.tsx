import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Splitter from './Splitter';

const meta = {
  title: 'Examples/Splitter',
  component: Splitter,
  tags: ['autodocs']
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

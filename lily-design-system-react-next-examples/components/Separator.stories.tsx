import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Separator from './Separator';

const meta = {
  title: 'Examples/Separator',
  component: Separator,
  tags: ['autodocs']
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Label from './Label';

const meta = {
  title: 'Examples/Label',
  component: Label,
  tags: ['autodocs']
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

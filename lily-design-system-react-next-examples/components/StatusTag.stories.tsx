import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import StatusTag from './StatusTag';

const meta = {
  title: 'Examples/StatusTag',
  component: StatusTag,
  tags: ['autodocs']
} satisfies Meta<typeof StatusTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

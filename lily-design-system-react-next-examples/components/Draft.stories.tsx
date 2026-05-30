import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Draft from './Draft';

const meta = {
  title: 'Examples/Draft',
  component: Draft,
  tags: ['autodocs']
} satisfies Meta<typeof Draft>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

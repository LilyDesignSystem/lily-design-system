import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Organization from './Organization';

const meta = {
  title: 'Examples/Organization',
  component: Organization,
  tags: ['autodocs']
} satisfies Meta<typeof Organization>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

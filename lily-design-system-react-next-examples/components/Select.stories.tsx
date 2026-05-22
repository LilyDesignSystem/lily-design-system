import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Select from './Select';

const meta = {
  title: 'Examples/Select',
  component: Select,
  tags: ['autodocs']
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

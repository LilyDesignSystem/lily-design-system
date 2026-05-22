import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import WeekInput from './WeekInput';

const meta = {
  title: 'Examples/WeekInput',
  component: WeekInput,
  tags: ['autodocs']
} satisfies Meta<typeof WeekInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

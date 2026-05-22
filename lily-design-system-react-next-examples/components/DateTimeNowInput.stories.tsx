import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DateTimeNowInput from './DateTimeNowInput';

const meta = {
  title: 'Examples/DateTimeNowInput',
  component: DateTimeNowInput,
  tags: ['autodocs']
} satisfies Meta<typeof DateTimeNowInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

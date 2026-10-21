import type { Meta, StoryObj } from '@storybook/react-vite';
import DateTimeNowInput from './DateTimeNowInput';

const meta = {
  title: 'Headless/DateTimeNowInput',
  component: DateTimeNowInput,
  tags: ['autodocs']
} satisfies Meta<typeof DateTimeNowInput>;

export default meta;
type Story = StoryObj<typeof DateTimeNowInput>;

export const Default: Story = {};

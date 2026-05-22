import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DateTimeLocalInput from './DateTimeLocalInput';

const meta = {
  title: 'Examples/DateTimeLocalInput',
  component: DateTimeLocalInput,
  tags: ['autodocs']
} satisfies Meta<typeof DateTimeLocalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

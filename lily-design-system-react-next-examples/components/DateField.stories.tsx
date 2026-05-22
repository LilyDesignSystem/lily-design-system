import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DateField from './DateField';

const meta = {
  title: 'Examples/DateField',
  component: DateField,
  tags: ['autodocs']
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-vite';
import DateField from './DateField';

const meta = {
  title: 'Headless/DateField',
  component: DateField,
  tags: ['autodocs']
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-vite';
import DateField from './DateField';

const meta = {
  title: 'Headless/DateField',
  component: DateField,
  tags: ['autodocs']
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof DateField>;

export const Default: Story = {};

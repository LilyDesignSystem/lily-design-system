import type { Meta, StoryObj } from '@storybook/react-vite';
import DateTimeLocalInput from './DateTimeLocalInput';

const meta = {
  title: 'Headless/DateTimeLocalInput',
  component: DateTimeLocalInput,
  tags: ['autodocs']
} satisfies Meta<typeof DateTimeLocalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

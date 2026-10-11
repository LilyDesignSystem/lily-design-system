import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarTableRow from './CalendarTableRow';

const meta = {
  title: 'Headless/CalendarTableRow',
  component: CalendarTableRow,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

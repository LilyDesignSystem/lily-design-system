import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarTableBody from './CalendarTableBody';

const meta = {
  title: 'Headless/CalendarTableBody',
  component: CalendarTableBody,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableBody>;

export default meta;
type Story = StoryObj<typeof CalendarTableBody>;

export const Default: Story = {};

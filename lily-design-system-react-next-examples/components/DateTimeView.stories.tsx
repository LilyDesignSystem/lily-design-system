import type { Meta, StoryObj } from '@storybook/react-vite';
import DateTimeView from './DateTimeView';

const meta = {
  title: 'Headless/DateTimeView',
  component: DateTimeView,
  tags: ['autodocs']
} satisfies Meta<typeof DateTimeView>;

export default meta;
type Story = StoryObj<typeof DateTimeView>;

export const Default: Story = {};

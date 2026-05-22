import type { Meta, StoryObj } from '@storybook/react-vite';
import TimeInput from './TimeInput';

const meta = {
  title: 'Headless/TimeInput',
  component: TimeInput,
  tags: ['autodocs']
} satisfies Meta<typeof TimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

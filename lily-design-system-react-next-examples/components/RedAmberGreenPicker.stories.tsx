import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RedAmberGreenPicker from './RedAmberGreenPicker';

const meta = {
  title: 'Examples/RedAmberGreenPicker',
  component: RedAmberGreenPicker,
  tags: ['autodocs']
} satisfies Meta<typeof RedAmberGreenPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

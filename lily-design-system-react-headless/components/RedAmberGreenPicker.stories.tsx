import type { Meta, StoryObj } from '@storybook/react-vite';
import RedAmberGreenPicker from './RedAmberGreenPicker';

const meta = {
  title: 'Headless/RedAmberGreenPicker',
  component: RedAmberGreenPicker,
  tags: ['autodocs']
} satisfies Meta<typeof RedAmberGreenPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

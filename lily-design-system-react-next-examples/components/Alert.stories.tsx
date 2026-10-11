import type { Meta, StoryObj } from '@storybook/react-vite';
import Alert from './Alert';

const meta = {
  title: 'Headless/Alert',
  component: Alert,
  tags: ['autodocs']
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

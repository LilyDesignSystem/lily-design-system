import type { Meta, StoryObj } from '@storybook/react-vite';
import ErrorMessage from './ErrorMessage';

const meta = {
  title: 'Headless/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs']
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

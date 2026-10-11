import type { Meta, StoryObj } from '@storybook/react-vite';
import IconButton from './IconButton';

const meta = {
  title: 'Headless/IconButton',
  component: IconButton,
  tags: ['autodocs']
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

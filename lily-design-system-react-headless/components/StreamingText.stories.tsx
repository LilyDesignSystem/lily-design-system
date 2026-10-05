import type { Meta, StoryObj } from '@storybook/react-vite';
import StreamingText from './StreamingText';

const meta = {
  title: 'Headless/StreamingText',
  component: StreamingText,
  tags: ['autodocs']
} satisfies Meta<typeof StreamingText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

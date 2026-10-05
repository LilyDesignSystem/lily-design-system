import type { Meta, StoryObj } from '@storybook/react-vite';
import ChatComposer from './ChatComposer';

const meta = {
  title: 'Headless/ChatComposer',
  component: ChatComposer,
  tags: ['autodocs']
} satisfies Meta<typeof ChatComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

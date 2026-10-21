import type { Meta, StoryObj } from '@storybook/react-vite';
import Sidebar from './Sidebar';

const meta = {
  title: 'Headless/Sidebar',
  component: Sidebar,
  tags: ['autodocs']
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};

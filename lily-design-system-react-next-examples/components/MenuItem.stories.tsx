import type { Meta, StoryObj } from '@storybook/react-vite';
import MenuItem from './MenuItem';

const meta = {
  title: 'Headless/MenuItem',
  component: MenuItem,
  tags: ['autodocs']
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

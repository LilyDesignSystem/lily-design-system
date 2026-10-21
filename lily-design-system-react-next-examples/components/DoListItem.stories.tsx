import type { Meta, StoryObj } from '@storybook/react-vite';
import DoListItem from './DoListItem';

const meta = {
  title: 'Headless/DoListItem',
  component: DoListItem,
  tags: ['autodocs']
} satisfies Meta<typeof DoListItem>;

export default meta;
type Story = StoryObj<typeof DoListItem>;

export const Default: Story = {};

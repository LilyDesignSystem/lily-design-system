import type { Meta, StoryObj } from '@storybook/react-vite';
import Picture from './Picture';

const meta = {
  title: 'Headless/Picture',
  component: Picture,
  tags: ['autodocs']
} satisfies Meta<typeof Picture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

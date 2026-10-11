import type { Meta, StoryObj } from '@storybook/react-vite';
import Citation from './Citation';

const meta = {
  title: 'Headless/Citation',
  component: Citation,
  tags: ['autodocs']
} satisfies Meta<typeof Citation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

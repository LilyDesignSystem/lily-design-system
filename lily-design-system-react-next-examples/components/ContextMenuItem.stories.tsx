import type { Meta, StoryObj } from '@storybook/react-vite';
import ContextMenuItem from './ContextMenuItem';

const meta = {
  title: 'Headless/ContextMenuItem',
  component: ContextMenuItem,
  tags: ['autodocs']
} satisfies Meta<typeof ContextMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

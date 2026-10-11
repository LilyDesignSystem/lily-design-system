import type { Meta, StoryObj } from '@storybook/react-vite';
import Resizable from './Resizable';

const meta = {
  title: 'Headless/Resizable',
  component: Resizable,
  tags: ['autodocs']
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

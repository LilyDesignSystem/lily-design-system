import type { Meta, StoryObj } from '@storybook/react-vite';
import MockupWindow from './MockupWindow';

const meta = {
  title: 'Headless/MockupWindow',
  component: MockupWindow,
  tags: ['autodocs']
} satisfies Meta<typeof MockupWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

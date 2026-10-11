import type { Meta, StoryObj } from '@storybook/react-vite';
import ScrollBar from './ScrollBar';

const meta = {
  title: 'Headless/ScrollBar',
  component: ScrollBar,
  tags: ['autodocs']
} satisfies Meta<typeof ScrollBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-vite';
import ScrollArea from './ScrollArea';

const meta = {
  title: 'Headless/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs']
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

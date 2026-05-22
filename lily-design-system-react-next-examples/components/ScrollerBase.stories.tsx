import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ScrollerBase from './ScrollerBase';

const meta = {
  title: 'Examples/ScrollerBase',
  component: ScrollerBase,
  tags: ['autodocs']
} satisfies Meta<typeof ScrollerBase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Scroller from './Scroller';

const meta = {
  title: 'Examples/Scroller',
  component: Scroller,
  tags: ['autodocs']
} satisfies Meta<typeof Scroller>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

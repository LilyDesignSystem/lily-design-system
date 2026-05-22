import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ContentsNav from './ContentsNav';

const meta = {
  title: 'Examples/ContentsNav',
  component: ContentsNav,
  tags: ['autodocs']
} satisfies Meta<typeof ContentsNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

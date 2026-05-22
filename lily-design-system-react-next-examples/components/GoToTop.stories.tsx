import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GoToTop from './GoToTop';

const meta = {
  title: 'Examples/GoToTop',
  component: GoToTop,
  tags: ['autodocs']
} satisfies Meta<typeof GoToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

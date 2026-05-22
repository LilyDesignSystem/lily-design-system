import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Loading from './Loading';

const meta = {
  title: 'Examples/Loading',
  component: Loading,
  tags: ['autodocs']
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

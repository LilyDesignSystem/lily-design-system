import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Caption from './Caption';

const meta = {
  title: 'Examples/Caption',
  component: Caption,
  tags: ['autodocs']
} satisfies Meta<typeof Caption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

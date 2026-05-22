import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TreeLink from './TreeLink';

const meta = {
  title: 'Examples/TreeLink',
  component: TreeLink,
  tags: ['autodocs']
} satisfies Meta<typeof TreeLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-vite';
import TreeList from './TreeList';

const meta = {
  title: 'Headless/TreeList',
  component: TreeList,
  tags: ['autodocs']
} satisfies Meta<typeof TreeList>;

export default meta;
type Story = StoryObj<typeof TreeList>;

export const Default: Story = {};

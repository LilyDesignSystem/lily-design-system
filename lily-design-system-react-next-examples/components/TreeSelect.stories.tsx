import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TreeSelect from './TreeSelect';

const meta = {
  title: 'Examples/TreeSelect',
  component: TreeSelect,
  tags: ['autodocs']
} satisfies Meta<typeof TreeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

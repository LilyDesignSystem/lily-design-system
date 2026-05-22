import type { Meta, StoryObj } from '@storybook/react-vite';
import TreeNav from './TreeNav';

const meta = {
  title: 'Headless/TreeNav',
  component: TreeNav,
  tags: ['autodocs']
} satisfies Meta<typeof TreeNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

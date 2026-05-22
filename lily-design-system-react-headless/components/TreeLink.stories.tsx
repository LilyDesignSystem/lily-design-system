import type { Meta, StoryObj } from '@storybook/react-vite';
import TreeLink from './TreeLink';

const meta = {
  title: 'Headless/TreeLink',
  component: TreeLink,
  tags: ['autodocs']
} satisfies Meta<typeof TreeLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

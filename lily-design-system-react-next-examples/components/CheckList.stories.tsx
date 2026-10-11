import type { Meta, StoryObj } from '@storybook/react-vite';
import CheckList from './CheckList';

const meta = {
  title: 'Headless/CheckList',
  component: CheckList,
  tags: ['autodocs']
} satisfies Meta<typeof CheckList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

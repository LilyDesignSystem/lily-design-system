import type { Meta, StoryObj } from '@storybook/react-vite';
import IconList from './IconList';

const meta = {
  title: 'Headless/IconList',
  component: IconList,
  tags: ['autodocs']
} satisfies Meta<typeof IconList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-vite';
import Tag from './Tag';

const meta = {
  title: 'Headless/Tag',
  component: Tag,
  tags: ['autodocs']
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

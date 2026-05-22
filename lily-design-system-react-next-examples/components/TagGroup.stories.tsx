import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TagGroup from './TagGroup';

const meta = {
  title: 'Examples/TagGroup',
  component: TagGroup,
  tags: ['autodocs']
} satisfies Meta<typeof TagGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-vite';
import TagGroup from './TagGroup';

const meta = {
  title: 'Headless/TagGroup',
  component: TagGroup,
  tags: ['autodocs']
} satisfies Meta<typeof TagGroup>;

export default meta;
type Story = StoryObj<typeof TagGroup>;

export const Default: Story = {};

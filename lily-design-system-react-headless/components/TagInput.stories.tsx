import type { Meta, StoryObj } from '@storybook/react-vite';
import TagInput from './TagInput';

const meta = {
  title: 'Headless/TagInput',
  component: TagInput,
  tags: ['autodocs']
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {};

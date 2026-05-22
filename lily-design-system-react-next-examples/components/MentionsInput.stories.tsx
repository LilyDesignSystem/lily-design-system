import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MentionsInput from './MentionsInput';

const meta = {
  title: 'Examples/MentionsInput',
  component: MentionsInput,
  tags: ['autodocs']
} satisfies Meta<typeof MentionsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

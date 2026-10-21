import type { Meta, StoryObj } from '@storybook/react-vite';
import MentionsInput from './MentionsInput';

const meta = {
  title: 'Headless/MentionsInput',
  component: MentionsInput,
  tags: ['autodocs']
} satisfies Meta<typeof MentionsInput>;

export default meta;
type Story = StoryObj<typeof MentionsInput>;

export const Default: Story = {};

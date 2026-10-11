import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MentionsInput from './MentionsInput.vue';

const meta = {
  title: 'Headless/MentionsInput',
  component: MentionsInput,
  tags: ['autodocs']
} satisfies Meta<typeof MentionsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

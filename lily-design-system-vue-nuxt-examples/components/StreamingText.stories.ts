import type { Meta, StoryObj } from '@storybook/vue3-vite';
import StreamingText from './StreamingText.vue';

const meta = {
  title: 'Headless/StreamingText',
  component: StreamingText,
  tags: ['autodocs']
} satisfies Meta<typeof StreamingText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScrollArea from './ScrollArea.vue';

const meta = {
  title: 'Headless/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs']
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

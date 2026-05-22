import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EndNotes from './EndNotes.vue';

const meta = {
  title: 'Headless/EndNotes',
  component: EndNotes,
  tags: ['autodocs']
} satisfies Meta<typeof EndNotes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

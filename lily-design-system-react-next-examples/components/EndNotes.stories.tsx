import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EndNotes from './EndNotes';

const meta = {
  title: 'Examples/EndNotes',
  component: EndNotes,
  tags: ['autodocs']
} satisfies Meta<typeof EndNotes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-vite';
import EndNotes from './EndNotes';

const meta = {
  title: 'Headless/EndNotes',
  component: EndNotes,
  tags: ['autodocs']
} satisfies Meta<typeof EndNotes>;

export default meta;
type Story = StoryObj<typeof EndNotes>;

export const Default: Story = {};

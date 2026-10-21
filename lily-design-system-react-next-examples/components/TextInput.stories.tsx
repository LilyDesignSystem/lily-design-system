import type { Meta, StoryObj } from '@storybook/react-vite';
import TextInput from './TextInput';

const meta = {
  title: 'Headless/TextInput',
  component: TextInput,
  tags: ['autodocs']
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {};

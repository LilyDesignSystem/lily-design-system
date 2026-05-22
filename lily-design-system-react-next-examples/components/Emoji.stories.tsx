import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Emoji from './Emoji';

const meta = {
  title: 'Examples/Emoji',
  component: Emoji,
  tags: ['autodocs']
} satisfies Meta<typeof Emoji>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

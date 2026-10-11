import type { Meta, StoryObj } from '@storybook/react-vite';
import Emoji from './Emoji';

const meta = {
  title: 'Headless/Emoji',
  component: Emoji,
  tags: ['autodocs']
} satisfies Meta<typeof Emoji>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

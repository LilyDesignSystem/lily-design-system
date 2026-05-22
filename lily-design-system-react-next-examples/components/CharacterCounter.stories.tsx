import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CharacterCounter from './CharacterCounter';

const meta = {
  title: 'Examples/CharacterCounter',
  component: CharacterCounter,
  tags: ['autodocs']
} satisfies Meta<typeof CharacterCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

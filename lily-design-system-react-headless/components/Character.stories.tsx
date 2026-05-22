import type { Meta, StoryObj } from '@storybook/react-vite';
import Character from './Character';

const meta = {
  title: 'Headless/Character',
  component: Character,
  tags: ['autodocs']
} satisfies Meta<typeof Character>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Character from './Character.vue';

const meta = {
  title: 'Headless/Character',
  component: Character,
  tags: ['autodocs']
} satisfies Meta<typeof Character>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

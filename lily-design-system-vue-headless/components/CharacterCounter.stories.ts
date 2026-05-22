import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CharacterCounter from './CharacterCounter.vue';

const meta = {
  title: 'Headless/CharacterCounter',
  component: CharacterCounter,
  tags: ['autodocs']
} satisfies Meta<typeof CharacterCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

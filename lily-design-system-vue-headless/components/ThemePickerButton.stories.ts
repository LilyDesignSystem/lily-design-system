import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ThemeSelectButton from './ThemeSelectButton.vue';

const meta = {
  title: 'Headless/ThemeSelectButton',
  component: ThemeSelectButton,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeSelectButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

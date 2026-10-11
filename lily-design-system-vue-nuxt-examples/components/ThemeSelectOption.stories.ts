import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ThemeSelectOption from './ThemeSelectOption.vue';

const meta = {
  title: 'Headless/ThemeSelectOption',
  component: ThemeSelectOption,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeSelectOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

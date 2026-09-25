import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BrasilCartaoNacionalDeSaudeView from './BrasilCartaoNacionalDeSaudeView.vue';

const meta = {
  title: 'Headless/BrasilCartaoNacionalDeSaudeView',
  component: BrasilCartaoNacionalDeSaudeView,
  tags: ['autodocs']
} satisfies Meta<typeof BrasilCartaoNacionalDeSaudeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BrasilCartaoNacionalDeSaudeView' }
};

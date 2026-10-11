import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BrasilCartaoNacionalDeSaudeInput from './BrasilCartaoNacionalDeSaudeInput.vue';

const meta = {
  title: 'Headless/BrasilCartaoNacionalDeSaudeInput',
  component: BrasilCartaoNacionalDeSaudeInput,
  tags: ['autodocs']
} satisfies Meta<typeof BrasilCartaoNacionalDeSaudeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BrasilCartaoNacionalDeSaudeInput' }
};

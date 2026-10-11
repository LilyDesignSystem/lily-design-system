import type { Meta, StoryObj } from '@storybook/react-vite';
import BrasilCartaoNacionalDeSaudeView from './BrasilCartaoNacionalDeSaudeView';

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

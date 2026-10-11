import type { Meta, StoryObj } from '@storybook/react-vite';
import BrasilCartaoNacionalDeSaudeInput from './BrasilCartaoNacionalDeSaudeInput';

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

import type { Meta, StoryObj } from '@storybook/react-vite';
import ChileRolUnicoNacionalView from './ChileRolUnicoNacionalView';

const meta = {
  title: 'Headless/ChileRolUnicoNacionalView',
  component: ChileRolUnicoNacionalView,
  tags: ['autodocs']
} satisfies Meta<typeof ChileRolUnicoNacionalView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'ChileRolUnicoNacionalView' }
};

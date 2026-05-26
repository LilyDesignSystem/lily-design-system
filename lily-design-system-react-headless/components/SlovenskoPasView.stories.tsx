import type { Meta, StoryObj } from '@storybook/react-vite';
import SlovenskoPasView from './SlovenskoPasView';

const meta = {
  title: 'Headless/SlovenskoPasView',
  component: SlovenskoPasView,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenskoPasView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenskoPasView' }
};

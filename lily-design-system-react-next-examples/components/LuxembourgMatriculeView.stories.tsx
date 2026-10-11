import type { Meta, StoryObj } from '@storybook/react-vite';
import LuxembourgMatriculeView from './LuxembourgMatriculeView';

const meta = {
  title: 'Headless/LuxembourgMatriculeView',
  component: LuxembourgMatriculeView,
  tags: ['autodocs']
} satisfies Meta<typeof LuxembourgMatriculeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LuxembourgMatriculeView' }
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import SouthAfricaIdentityNumberView from './SouthAfricaIdentityNumberView';

const meta = {
  title: 'Headless/SouthAfricaIdentityNumberView',
  component: SouthAfricaIdentityNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof SouthAfricaIdentityNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SouthAfricaIdentityNumberView' }
};

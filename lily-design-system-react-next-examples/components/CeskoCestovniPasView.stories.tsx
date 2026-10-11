import type { Meta, StoryObj } from '@storybook/react-vite';
import CeskoCestovniPasView from './CeskoCestovniPasView';

const meta = {
  title: 'Headless/CeskoCestovniPasView',
  component: CeskoCestovniPasView,
  tags: ['autodocs']
} satisfies Meta<typeof CeskoCestovniPasView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CeskoCestovniPasView' }
};

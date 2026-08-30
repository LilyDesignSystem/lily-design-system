import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CeskoCestovniPasView from './CeskoCestovniPasView';

const meta = {
  title: 'Examples/CeskoCestovniPasView',
  component: CeskoCestovniPasView,
  tags: ['autodocs']
} satisfies Meta<typeof CeskoCestovniPasView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CeskoCestovniPasView' }
};

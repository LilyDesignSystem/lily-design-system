import type { Meta, StoryObj } from '@storybook/react-vite';
import NihonKojinBangoView from './NihonKojinBangoView';

const meta = {
  title: 'Headless/NihonKojinBangoView',
  component: NihonKojinBangoView,
  tags: ['autodocs']
} satisfies Meta<typeof NihonKojinBangoView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NihonKojinBangoView' }
};

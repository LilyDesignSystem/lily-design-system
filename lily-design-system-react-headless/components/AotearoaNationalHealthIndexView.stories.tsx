import type { Meta, StoryObj } from '@storybook/react-vite';
import AotearoaNationalHealthIndexView from './AotearoaNationalHealthIndexView';

const meta = {
  title: 'Headless/AotearoaNationalHealthIndexView',
  component: AotearoaNationalHealthIndexView,
  tags: ['autodocs']
} satisfies Meta<typeof AotearoaNationalHealthIndexView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'AotearoaNationalHealthIndexView' }
};

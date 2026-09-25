import type { Meta, StoryObj } from '@storybook/react-vite';
import YisraelTeudatZehutView from './YisraelTeudatZehutView';

const meta = {
  title: 'Headless/YisraelTeudatZehutView',
  component: YisraelTeudatZehutView,
  tags: ['autodocs']
} satisfies Meta<typeof YisraelTeudatZehutView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'YisraelTeudatZehutView' }
};

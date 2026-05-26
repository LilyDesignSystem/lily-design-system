import type { Meta, StoryObj } from '@storybook/react-vite';
import LiechtensteinPassportNumberView from './LiechtensteinPassportNumberView';

const meta = {
  title: 'Headless/LiechtensteinPassportNumberView',
  component: LiechtensteinPassportNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof LiechtensteinPassportNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LiechtensteinPassportNumberView' }
};

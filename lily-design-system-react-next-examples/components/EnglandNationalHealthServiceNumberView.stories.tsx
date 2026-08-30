import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EnglandNationalHealthServiceNumberView from './EnglandNationalHealthServiceNumberView';

const meta = {
  title: 'Examples/EnglandNationalHealthServiceNumberView',
  component: EnglandNationalHealthServiceNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof EnglandNationalHealthServiceNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EnglandNationalHealthServiceNumberView' }
};

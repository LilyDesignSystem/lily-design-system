import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MaltaPassportNumberView from './MaltaPassportNumberView';

const meta = {
  title: 'Examples/MaltaPassportNumberView',
  component: MaltaPassportNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof MaltaPassportNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MaltaPassportNumberView' }
};

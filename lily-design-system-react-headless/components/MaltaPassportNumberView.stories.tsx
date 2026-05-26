import type { Meta, StoryObj } from '@storybook/react-vite';
import MaltaPassportNumberView from './MaltaPassportNumberView';

const meta = {
  title: 'Headless/MaltaPassportNumberView',
  component: MaltaPassportNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof MaltaPassportNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MaltaPassportNumberView' }
};

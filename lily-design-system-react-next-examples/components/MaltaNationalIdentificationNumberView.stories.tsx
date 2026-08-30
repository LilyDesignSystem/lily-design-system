import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MaltaNationalIdentificationNumberView from './MaltaNationalIdentificationNumberView';

const meta = {
  title: 'Examples/MaltaNationalIdentificationNumberView',
  component: MaltaNationalIdentificationNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof MaltaNationalIdentificationNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MaltaNationalIdentificationNumberView' }
};

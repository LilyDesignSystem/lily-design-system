import type { Meta, StoryObj } from '@storybook/react-vite';
import MaltaNationalIdentificationNumberView from './MaltaNationalIdentificationNumberView';

const meta = {
  title: 'Headless/MaltaNationalIdentificationNumberView',
  component: MaltaNationalIdentificationNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof MaltaNationalIdentificationNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MaltaNationalIdentificationNumberView' }
};

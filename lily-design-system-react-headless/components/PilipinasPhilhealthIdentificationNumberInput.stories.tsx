import type { Meta, StoryObj } from '@storybook/react-vite';
import PilipinasPhilhealthIdentificationNumberInput from './PilipinasPhilhealthIdentificationNumberInput';

const meta = {
  title: 'Headless/PilipinasPhilhealthIdentificationNumberInput',
  component: PilipinasPhilhealthIdentificationNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof PilipinasPhilhealthIdentificationNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PilipinasPhilhealthIdentificationNumberInput' }
};

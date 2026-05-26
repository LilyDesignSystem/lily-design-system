import type { Meta, StoryObj } from '@storybook/react-vite';
import MaltaPassportNumberInput from './MaltaPassportNumberInput';

const meta = {
  title: 'Headless/MaltaPassportNumberInput',
  component: MaltaPassportNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof MaltaPassportNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MaltaPassportNumberInput' }
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import EnglandNationalHealthServiceNumberInput from './EnglandNationalHealthServiceNumberInput';

const meta = {
  title: 'Headless/EnglandNationalHealthServiceNumberInput',
  component: EnglandNationalHealthServiceNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof EnglandNationalHealthServiceNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'EnglandNationalHealthServiceNumberInput' }
};

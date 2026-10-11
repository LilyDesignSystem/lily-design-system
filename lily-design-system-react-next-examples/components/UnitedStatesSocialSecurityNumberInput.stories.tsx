import type { Meta, StoryObj } from '@storybook/react-vite';
import UnitedStatesSocialSecurityNumberInput from './UnitedStatesSocialSecurityNumberInput';

const meta = {
  title: 'Headless/UnitedStatesSocialSecurityNumberInput',
  component: UnitedStatesSocialSecurityNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedStatesSocialSecurityNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

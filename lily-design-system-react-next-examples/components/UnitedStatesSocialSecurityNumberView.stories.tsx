import type { Meta, StoryObj } from '@storybook/react-vite';
import UnitedStatesSocialSecurityNumberView from './UnitedStatesSocialSecurityNumberView';

const meta = {
  title: 'Headless/UnitedStatesSocialSecurityNumberView',
  component: UnitedStatesSocialSecurityNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedStatesSocialSecurityNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

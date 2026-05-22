import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import UnitedStatesSocialSecurityNumberView from './UnitedStatesSocialSecurityNumberView';

const meta = {
  title: 'Examples/UnitedStatesSocialSecurityNumberView',
  component: UnitedStatesSocialSecurityNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedStatesSocialSecurityNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

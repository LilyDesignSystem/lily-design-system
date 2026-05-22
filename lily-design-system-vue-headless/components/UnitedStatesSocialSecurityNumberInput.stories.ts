import type { Meta, StoryObj } from '@storybook/vue3-vite';
import UnitedStatesSocialSecurityNumberInput from './UnitedStatesSocialSecurityNumberInput.vue';

const meta = {
  title: 'Headless/UnitedStatesSocialSecurityNumberInput',
  component: UnitedStatesSocialSecurityNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedStatesSocialSecurityNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import UnitedStatesSocialSecurityNumberView from './UnitedStatesSocialSecurityNumberView.vue';

const meta = {
  title: 'Headless/UnitedStatesSocialSecurityNumberView',
  component: UnitedStatesSocialSecurityNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof UnitedStatesSocialSecurityNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

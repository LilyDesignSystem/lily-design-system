import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PasswordInputOrTextInputDiv from './PasswordInputOrTextInputDiv.vue';

const meta = {
  title: 'Examples/PasswordInputOrTextInputDiv',
  component: PasswordInputOrTextInputDiv,
  tags: ['autodocs']
} satisfies Meta<typeof PasswordInputOrTextInputDiv>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

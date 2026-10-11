import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SwitchButton from './SwitchButton.vue';

const meta = {
  title: 'Headless/SwitchButton',
  component: SwitchButton,
  tags: ['autodocs']
} satisfies Meta<typeof SwitchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

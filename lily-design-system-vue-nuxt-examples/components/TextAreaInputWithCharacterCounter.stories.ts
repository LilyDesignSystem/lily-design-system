import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TextAreaInputWithCharacterCounter from './TextAreaInputWithCharacterCounter.vue';

const meta = {
  title: 'Examples/TextAreaInputWithCharacterCounter',
  component: TextAreaInputWithCharacterCounter,
  tags: ['autodocs']
} satisfies Meta<typeof TextAreaInputWithCharacterCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

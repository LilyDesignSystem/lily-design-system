import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HangukJuminDeungnokBeonhoInput from './HangukJuminDeungnokBeonhoInput.vue';

const meta = {
  title: 'Headless/HangukJuminDeungnokBeonhoInput',
  component: HangukJuminDeungnokBeonhoInput,
  tags: ['autodocs']
} satisfies Meta<typeof HangukJuminDeungnokBeonhoInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'HangukJuminDeungnokBeonhoInput' }
};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CymruRhifYGwasanaethIechydGwladolInput from './CymruRhifYGwasanaethIechydGwladolInput.vue';

const meta = {
  title: 'Headless/CymruRhifYGwasanaethIechydGwladolInput',
  component: CymruRhifYGwasanaethIechydGwladolInput,
  tags: ['autodocs']
} satisfies Meta<typeof CymruRhifYGwasanaethIechydGwladolInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CymruRhifYGwasanaethIechydGwladolInput' }
};

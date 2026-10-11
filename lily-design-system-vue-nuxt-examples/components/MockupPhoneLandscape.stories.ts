import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MockupPhoneLandscape from './MockupPhoneLandscape.vue';

const meta = {
  title: 'Headless/MockupPhoneLandscape',
  component: MockupPhoneLandscape,
  tags: ['autodocs']
} satisfies Meta<typeof MockupPhoneLandscape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SectionNav from './SectionNav.vue';

const meta = {
  title: 'Headless/SectionNav',
  component: SectionNav,
  tags: ['autodocs']
} satisfies Meta<typeof SectionNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

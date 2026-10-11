import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FranceNumeroDIdentificationAuRepertoireView from './FranceNumeroDIdentificationAuRepertoireView.vue';

const meta = {
  title: 'Headless/FranceNumeroDIdentificationAuRepertoireView',
  component: FranceNumeroDIdentificationAuRepertoireView,
  tags: ['autodocs']
} satisfies Meta<typeof FranceNumeroDIdentificationAuRepertoireView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

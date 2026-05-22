import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EspanaTarjetaSanitariaIndividualView from './EspanaTarjetaSanitariaIndividualView.vue';

const meta = {
  title: 'Headless/EspanaTarjetaSanitariaIndividualView',
  component: EspanaTarjetaSanitariaIndividualView,
  tags: ['autodocs']
} satisfies Meta<typeof EspanaTarjetaSanitariaIndividualView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FiveStarRatingPicker from './FiveStarRatingPicker.svelte';

  const { Story } = defineMeta({
    title: 'Examples/FiveStarRatingPicker',
    component: FiveStarRatingPicker,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Five Star Rating Picker'}}
/>

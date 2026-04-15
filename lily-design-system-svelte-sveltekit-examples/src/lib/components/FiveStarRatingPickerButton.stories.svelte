<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FiveStarRatingPickerButton from './FiveStarRatingPickerButton.svelte';

  const { Story } = defineMeta({
    title: 'Examples/FiveStarRatingPickerButton',
    component: FiveStarRatingPickerButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Five Star Rating Picker Button'}}
/>

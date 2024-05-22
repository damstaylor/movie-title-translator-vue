<template>
  <div class="SearchDropdownInput relative">
    <input
      type="text"
      :placeholder="placeholder"
      :value="value"
      @input="onInput"
      class="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
    />
    <button
      v-if="value.length > 0"
      @click="onCancel"
      class="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
    >
      <FontAwesomeIcon :icon="timesIcon" />
    </button>
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default {
  components: { FontAwesomeIcon },
  props: {
    placeholder: String,
    value: { type: String, default: () => '' }
  },
  emits: ['input', 'cancel'],
  setup(props, { emit }) {
    const onInput = (event: Event) => emit('input', (event.target as HTMLButtonElement).value)
    const onCancel = () => emit('cancel')
    const timesIcon = faTimes

    return {
      onInput,
      onCancel,
      timesIcon
    }
  }
}
</script>

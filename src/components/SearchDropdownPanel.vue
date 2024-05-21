<template>
  <div
    class="SearchDropdownPanel absolute w-full z-10 mt-0.5 bg-white border border-gray-300 rounded-md shadow-lg"
  >
    <ul class="py-2" v-if="items.length > 0">
      <li
        v-for="(item, index) in items"
        :key="index"
        @click.stop="handleClick(item)"
        class="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 truncate"
      >
        <img :src="item.img" :alt="item.title" class="w-8 h-8 rounded-full object-cover" />
        <div class="labels ml-2">
          <span class="block text-sm font-semibold text-gray-800 truncate">{{ item.title }}</span>
          <span class="block text-xs text-gray-500">{{ item.subtitle }}</span>
        </div>
      </li>
    </ul>
    <span v-else>No results :(</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    items: { type: Array<DropdownItem>, default: () => [] }
  },
  setup(props, { emit }) {
    const handleClick = (item: DropdownItem) => {
      emit('click', item)
    }
    return {
      handleClick
    }
  }
})
</script>

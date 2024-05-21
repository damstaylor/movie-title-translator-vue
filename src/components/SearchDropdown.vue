<template>
  <div class="SearchDropdown relative">
    <SearchDropdownInput
      placeholder="Search movie title"
      :value="searchValue"
      @input="handleSearch"
      @cancel="cancelSearch"
    />
    <SearchDropdownPanel v-if="searchValue.length > 0" :items="items" @click="handleItemClick" />
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import SearchDropdownInput from './SearchDropdownInput.vue'
import SearchDropdownPanel from './SearchDropdownPanel.vue'

export default {
  components: { SearchDropdownInput, SearchDropdownPanel },
  props: {
    items: {
      type: Array<DropdownItem>,
      required: true
    }
  },
  emits: ['search-input', 'item-select'],
  setup(props, { emit }) {
    const searchValue = ref('')

    const handleSearch = (newVal: string) => {
      searchValue.value = newVal
      emit('search-input', newVal)
    }

    const cancelSearch = () => {
      searchValue.value = ''
    }

    const handleItemClick = (item: DropdownItem) => {
      emit('item-select', item)
      cancelSearch()
    }

    return {
      searchValue,
      handleSearch,
      cancelSearch,
      handleItemClick
    }
  }
}
</script>

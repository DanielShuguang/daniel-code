<script lang="tsx">
import { useBottomToolStore } from '@/store'
import { defineComponent, h } from 'vue'
import { bottomTools } from './data'

export default defineComponent({
  setup() {
    const bottomStore = useBottomToolStore()

    const leftTools = bottomTools.filter(el => el.position === 'left')
    const rightTools = bottomTools.filter(el => el.position === 'right')

    return () => (
      <footer class="bottom-toolbar">
        <div class="left-container">{leftTools.map(el => h(el.component))}</div>
        <div class="right-container">{rightTools.map(el => h(el.component))}</div>
      </footer>
    )
  }
})
</script>

<style lang="scss" scoped>
.bottom-toolbar {
  display: flex;
  background: var(--bottom-toolbar-background);

  .left-container,
  .right-container {
    flex: 1;
    display: flex;
    align-items: center;

    :deep() .bottom-tool-item {
      cursor: pointer;

      &:hover {
        background-color: var(--bottom-tool-hover-background);
      }
    }
  }
  .left-container {
    justify-content: flex-start;
    > :first-child {
      margin-right: 7px;
    }
  }
  .right-container {
    justify-content: flex-end;
    > :last-child {
      margin-right: 7px;
    }
  }
}
</style>

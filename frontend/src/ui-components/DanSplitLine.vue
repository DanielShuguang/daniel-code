<script lang="ts" setup>
import { Nullable, Vector2D } from '@/types/common'
import { cloneDeep, debounce } from 'lodash-es'
import { CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    /** @default 'vertical' */
    direction?: 'vertical' | 'horizontal'
    /** @default 'absolute' */
    position?: CSSProperties['position']
    defaultVector: Vector2D
    delay?: number
    reset?: boolean
  }>(),
  {
    position: 'absolute',
    direction: 'vertical',
    delay: 0,
    reset: true
  }
)

const emit = defineEmits<{
  (event: 'change', offset: number): void
  (event: 'resetClick', ev: MouseEvent): void
}>()

const isHovered = ref(false)
const isDragging = ref(false)
const currentPosition = ref({ x: 0, y: 0 })
const moveDistance = ref({ x: 0, y: 0 })
const hoverTimer = ref<Nullable<NodeJS.Timeout>>(null)

useEventListener('mousemove', ev => {
  if (!isDragging.value) return

  if (props.direction === 'vertical') {
    moveDistance.value.x += ev.movementX
    currentPosition.value.x += ev.movementX
  } else {
    moveDistance.value.y += ev.movementY
    currentPosition.value.y += ev.movementY
  }
  updatePosition()
})
useEventListener('mouseup', () => {
  if (isDragging.value) {
    isDragging.value = false
  }
})

const rootStyle = computed(() => {
  const styles = <CSSProperties>{
    position: props.position,
    left: currentPosition.value.x + 'px',
    top: currentPosition.value.y + 'px'
  }
  if (props.direction === 'vertical') {
    styles.height = '100%'
    styles.cursor = 'ew-resize'
  } else {
    styles.width = '100%'
    styles.cursor = 'ns-resize'
  }
  return styles
})

const handleEnter = () => {
  hoverTimer.value = setTimeout(() => {
    isHovered.value = true
  }, 500)
}
const handleLeave = () => {
  hoverTimer.value && clearTimeout(hoverTimer.value)
  isHovered.value = false
}
const handleReset = (ev: MouseEvent) => {
  currentPosition.value = cloneDeep(props.defaultVector)
  emit('resetClick', ev)
}

const updatePosition = debounce(() => {
  const { x, y } = moveDistance.value
  emit('change', x + y)
  moveDistance.value = { x: 0, y: 0 }
}, props.delay)

onMounted(() => {
  currentPosition.value = cloneDeep(props.defaultVector)
})
</script>

<template>
  <div
    :class="['dan-split-line', { hover: isHovered || isDragging }]"
    :style="rootStyle"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @mousedown.left="isDragging = true"
    @dblclick="handleReset"
  ></div>
</template>

<style lang="scss" scoped>
.dan-split-line {
  width: 4px;
  transition: background 0.3s ease;

  &.hover {
    background: var(--focus-border-color);
  }
}
</style>

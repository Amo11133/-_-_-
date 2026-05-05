<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="text-orange">{{ exercise?.name }}</h3>
        <button class="btn-close" @click="close">✖</button>
      </div>
      <div class="modal-body">
        <!-- Видео -->
        <div class="video-wrapper">
          <video v-if="videoSrc" controls class="exercise-video">
            <source :src="videoSrc" type="video/mp4">
            Ваш браузер не поддерживает видео.
          </video>
          <div v-else class="no-video">Видео отсутствует</div>
        </div>

        <!-- Профессиональное описание -->
        <div class="description">
          <h4>Техника выполнения</h4>
          <p>{{ exerciseDescription }}</p>
          <h4>Советы</h4>
          <ul>
            <li v-for="tip in exerciseTips" :key="tip">{{ tip }}</li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" @click="close">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  exercise: Object
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

// Сопоставление видео и текста по названию упражнения (можно расширить)
const exerciseVideos = {
  'жим лёжа': '/videos/bench_press.mp4',
  'приседания со штангой': '/videos/squat.mp4',      // название как в базе
  'присяд со штангой': '/videos/squat.mp4',          // альтернативное написание
  'подтягивание': '/videos/pullup.mp4',
  'трицепс в блоке': '/videos/triceps_pushdown.mp4'
}

const exerciseDescriptions = {
  'жим лёжа': 'Лягте на скамью, ноги плотно на полу. Возьмитесь за гриф чуть шире плеч. Опустите штангу к груди, локти под углом 45 градусов. Выжмите вверх, полностью выпрямляя руки. Дышите равномерно.',
  'присяд со штангой': 'Встаньте под штангу, расположив её на трапеции. Снимите гриф, сделайте шаг назад. Сгибайте колени, держа спину прямой. Опускайтесь до параллели бёдер с полом. Вернитесь в исходное положение.',
  'подтягивание': 'Повисните на перекладине хватом сверху чуть шире плеч. Сгибая локти, подтянитесь вверх, пока подбородок не окажется выше перекладины. Опускайтесь медленно.',
  'трицепс в блоке': 'Встаньте лицом к верхнему блоку. Возьмитесь за рукоятку, локти прижаты к корпусу. Разгибайте руки вниз до полного выпрямления. Медленно вернитесь в исходное.'
}

const exerciseTips = {
  'жим лёжа': ['Не отрывайте таз от скамьи', 'Контролируйте движение', 'Не выключайте локти в верхней точке'],
  'присяд со штангой': ['Держите спину прямой', 'Колени не заходят за носки', 'Смотрите вперёд'],
  'подтягивание': ['Используйте полную амплитуду', 'Не раскачивайтесь', 'Сосредоточьтесь на работе широчайших'],
  'трицепс в блоке': ['Не отводите локти в стороны', 'Контролируйте обратную фазу', 'Чувствуйте напряжение трицепса']
}

const videoSrc = computed(() => {
  if (!props.exercise) return null
  const name = props.exercise.name.toLowerCase()
  return exerciseVideos[name] || null
})

const exerciseDescription = computed(() => {
  if (!props.exercise) return ''
  const name = props.exercise.name.toLowerCase()
  return exerciseDescriptions[name] || 'Описание отсутствует.'
})

const exerciseTipsList = computed(() => {
  if (!props.exercise) return []
  const name = props.exercise.name.toLowerCase()
  return exerciseTips[name] || ['Следите за техникой', 'Разогревайтесь перед выполнением']
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-container {
  background-color: #1e293b;
  color: #fff;
  border-radius: 1rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1rem;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f97316;
  padding-bottom: 0.5rem;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #fff;
}
.video-wrapper {
  margin: 1rem 0;
}
.exercise-video {
  width: 100%;
  border-radius: 0.5rem;
}
.no-video {
  background-color: #334155;
  padding: 2rem;
  text-align: center;
}
.modal-footer {
  margin-top: 1rem;
  text-align: right;
}
</style>
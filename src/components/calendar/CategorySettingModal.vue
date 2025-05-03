<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-box">
      <button class="close-btn" @click="emit('close')">×</button>
      <div class="category-sidebar">
        <div
          v-for="category in categories"
          :key="category.id"
          :style="{
            backgroundColor: category.colorRgba,
            border: selectedCategoryId === category.id ? '2px solid #000' : '2px solid transparent'
          }"
          class="category-item"
          @click="selectCategory(category)"
        >
          {{ category.name }}
        </div>
        <div class="category-add" @click="handleAddCategory">+</div>
      </div>

      <div class="category-content">
        <h2>카테고리 설정</h2>

        <div class="form-group">
          <label>카테고리명</label>
          <input v-model="categoryName" class="category-input" />
        </div>

        <div class="form-group">
          <label>카테고리 색상</label>
          <div class="color-palette">
            <div
              v-for="color in colorOptions"
              :key="color.key"
              class="color-circle"
              :class="{ selected: selectedColorKey === color.key }"
              :style="{ backgroundColor: color.rgba }"
              @click="() => handleColorSelect(color)"
            ></div>
          </div>
        </div>

        <div class="button-row">
          <button class="save-btn" @click="handleSave"> 저장 </button>
          <button class="delete-btn" @click="confirmDelete"> 삭제 </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="confirm-box">
      <p>정말 삭제하시겠습니까?</p>
      <p class="sub">해당 카테고리에 속한 투두를 어떻게 처리할지 선택하세요.</p>
      <div class="confirm-actions">
        <button class="danger" @click="deleteCategory('delete')">전체 삭제</button>
        <button @click="deleteCategory('detach')">투두 유지</button>
        <button class="cancel" @click="showDeleteConfirm = false">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from '@/utils/axios'

const emit = defineEmits(['close', 'refresh'])
const clientNum = 6
const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
const categories = ref([])
const selectedCategoryId = ref(null)
const categoryName = ref('')
const selectedColorKey = ref('TURQUOISE')
const showDeleteConfirm = ref(false)
// 바깥 클릭 방지용 빈 함수
const preventClose = () => {}
const colorOptions = [
  { key: 'RED', rgba: 'rgba(255, 140, 154, 1)' },
  { key: 'ORANGE', rgba: 'rgba(255, 170, 140, 1)' },
  { key: 'LIGHT_GREEN', rgba: 'rgba(197, 230, 149, 1)' },
  { key: 'TURQUOISE', rgba: 'rgba(80, 212, 198, 1)' },
  { key: 'SKY_BLUE', rgba: 'rgba(140, 194, 255, 1)' },
  { key: 'PURPLE', rgba: 'rgba(174, 140, 255, 1)' },
  { key: 'VIOLET', rgba: 'rgba(193, 132, 202, 1)' }
]

onMounted(fetchCategories)

async function fetchCategories() {
  try {
    const { data } = await axios.get(`/personal-categories/${clientNum}`)
    categories.value = data.map(item => ({
      id: item.personalCategoryNum,
      name: item.personalCategoryName,
      colorRgba: item.personalCategoryColorRgb
    }))
    await nextTick()
    if (categories.value.length) selectCategory(categories.value[0])
  } catch (err) {
    console.error('[❌ fetchCategories 에러]', err)
  }
}

function selectCategory(category) {
  selectedCategoryId.value = category.id
  categoryName.value = category.name
  const found = colorOptions.find(opt => opt.rgba === category.colorRgba)
  selectedColorKey.value = found ? found.key : 'TURQUOISE'
}

function handleColorSelect(color) {
  selectedColorKey.value = color.key
  const selected = categories.value.find(cat => cat.id === selectedCategoryId.value)
  if (selected) {
    selected.colorRgba = color.rgba
  }
}

async function handleSave() {
  try {
    await axios.patch(
      `/personal-categories/${selectedCategoryId.value}`,
      { name: categoryName.value, color: selectedColorKey.value },
      { params: { clientNum } }
    )
    await fetchCategories()
    emit('refresh')
    alert('카테고리 수정 완료!')
  } catch (e) {
    console.error(e)
    alert('수정 실패!')
  }
}

async function handleAddCategory() {
  try {
    const baseName = '새 카테고리'
    let index = 1
    let finalName = baseName
    const nameExists = name => categories.value.some(c => c.name === name)

    while (nameExists(finalName)) {
      finalName = `${baseName} ${index++}`
    }

    await axios.post(`/personal-categories`, {
      name: finalName,
      color: selectedColorKey.value
    }, {
      params: { clientNum }
    })

    await fetchCategories()
    const created = categories.value.find(c => c.name === finalName)
    if (created) selectCategory(created)
  } catch (e) {
    alert('카테고리 추가 실패!')
  }
}

function confirmDelete() {
  showDeleteConfirm.value = true
}

async function deleteCategory(action) {
  try {
    await axios.delete(`/personal-categories/${selectedCategoryId.value}`, {
      params: { clientNum, action }
    })
    showDeleteConfirm.value = false
    await fetchCategories()
    if (categories.value.length) {
      selectCategory(categories.value[0])
    } else {
      selectedCategoryId.value = null
      categoryName.value = ''
      selectedColorKey.value = 'TURQUOISE'
    }
    emit('refresh')
  } catch (e) {
    console.error(e)
    alert('삭제 실패!')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
	
}

.modal-box {
  background: #fff;
  width: 700px;
  display: flex;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 22px;
  background: none;
  border: none;
  cursor: pointer;
}

.category-sidebar {
	padding-top: 10px;
  min-width: 160px;
  background: #f1f1f1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 340px;
  overflow-y: auto;
  box-sizing: content-box;
}

.category-item {
  padding: 8%;
  border-radius: 10px;
  color: #000;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  font-size: 13px;
  opacity: 0.8;
  background-color: rgba(255, 255, 255, 0.4);
}

.category-item:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.category-add {
  padding: 10px;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.2s ease;
  opacity: 0.9;
}

.category-add:hover {
  background: rgba(0, 0, 0, 1);
  opacity: 1;
}

.category-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.color-palette {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.color-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.color-circle.selected {
  border-color: #666;
  transform: scale(1.1);
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.save-btn,
.delete-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn {
  background: #000;
  color: #fff;
  border: 1px solid #eee;
}

.save-btn:hover {
  background: #fff;
  color: #000;
  border: 1px solid #000;
  transform: none;
}

.delete-btn {
  background: #eee;
  color: #000;
}

.delete-btn:hover {
  background: #ff4d4d;
  color: #fff;
}

.confirm-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  text-align: center;
  z-index: 1100;
}

.confirm-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.confirm-actions button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.confirm-actions .danger {
  background: #ff4d4d;
  color: #fff;
}

.confirm-actions .cancel {
  background: #ccc;
  color: #000;
}
.category-sidebar::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.sub {
  font-size: 13px;
  color: #666;
  margin-top: 6px;
}
</style>

<template>
    <div class="main-page">
      <div class="swiper-wrapper">
        <Swiper
          :modules="[Navigation, Autoplay, Pagination, EffectFade]"
          :loop="true"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          :speed="800"
          effect="fade"
          class="my-swiper"
          @swiper="onSwiper"
          @slideChangeTransitionStart="startBlur"
          @slideChangeTransitionEnd="endBlur"
        >
          <SwiperSlide v-for="(img, i) in images" :key="i">
            <div class="image-frame"></div>
            <img 
                :src="img"
                class="slide-img"
                :class="{ 'blur': isBlurring }"
                @load="handleBlurEffect"
            />        
          </SwiperSlide>
        </Swiper>
      </div>
  
      <div class="cta">
        <button @click="goToSignup">START to-do ddu-du</button>
      </div>
    </div>

  </template>
  
  <script setup>
  import { ref } from 'vue'
  import main01 from '../assets/main_images/main01.png'
  import main02 from '../assets/main_images/main02.png'
  import main03 from '../assets/main_images/main03.png'
  
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import SwiperCore, { Navigation, Autoplay, Pagination, EffectFade } from 'swiper'
  SwiperCore.use([Navigation, Autoplay, Pagination, EffectFade])
  
  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'
  import 'swiper/css/effect-fade'
  
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const goToSignup = () => router.push('/signup')
  
  const images = [main01, main02, main03]
  const swiperInstance = ref(null)
  
  const isBlurring = ref(false)
  const isTransitioning = ref(false)
  
  const onSwiper = (swiper) => {
    swiperInstance.value = swiper
  }
  
  const handleBlurEffect = () => {
    isBlurring.value = true
    setTimeout(() => {
      isBlurring.value = false
    }, 300)
  }
  const startBlur = () => {
    isTransitioning.value = true
  }
  const endBlur = () => {
    isTransitioning.value = false
  }
  </script>
  
  <style scoped>
  .swiper-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 22px;
  }
  
  .my-swiper {
    width: 1000px;
    height: 830px;
    overflow: hidden;
    border-radius: 10px;
  }
  
  .image-frame {
    /* position: absolute; */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background: linear-gradient(#ffffff, #c2e9fb, #495f81); */
    /* background: linear-gradient(to top, #d2f1ec, #ffffff); */
    background: linear-gradient(to top, #ccf3df, #ffffff);

    border-radius: 16px;
    z-index: 1;
  }
  
  .slide-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
    transition: filter 0.4s ease, transform 0.4s ease, opacity 0.4s ease;
  }
  
  .slide-img.blur {
    filter: blur(6px);
    transform: scale(1.01);
    opacity: 0.75;
  }
  
  ::v-deep(.swiper-pagination-bullet) {
    background-color: #ccc;
    opacity: 1;
  }
  
  ::v-deep(.swiper-pagination-bullet-active) {
    background-color: #ff9b9b;
  }
  
  .cta {
    display: flex;
    justify-content: center;
    margin-top: 80px;
    margin-bottom: 300px;
  }
  
  .cta button {
    background-color: #fff;
    color: #111;
    font-weight: bold;
    padding: 0.75rem 1.5rem;
    border: 2px solid #111;
    border-radius: 8px;
    font-size: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .cta button:hover {
    background-color: #111;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  </style>
  
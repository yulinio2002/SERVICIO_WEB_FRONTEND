import { useEffect, useRef } from 'react';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Container from '../components/common/Container';

const Inicio = () => {
  const swiperSlidersRef = useRef<Swiper | null>(null);
  const swiperBrandsRef = useRef<Swiper | null>(null);
  const swiperProductsRef = useRef<Swiper | null>(null);
  const swiperServicesRef = useRef<Swiper | null>(null);
  const swiperProductsFeaturedRef = useRef<Swiper | null>(null);

  useEffect(() => {
    // Initialize Swiper Sliders
    swiperSlidersRef.current = new Swiper('.swiper-sliders', {
      modules: [Navigation, Autoplay, EffectFade],
      loop: true,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      autoplay: {
        delay: 7000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.slider-button-next',
        prevEl: '.slider-button-prev',
      },
    });

    // Initialize Swiper Brands
    swiperBrandsRef.current = new Swiper('.swiper-brands', {
      modules: [Navigation, Autoplay],
      loop: true,
      autoplay: {
        delay: 7000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.courusel-button-next',
        prevEl: '.courusel-button-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 70,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 50,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 70,
        },
        1280: {
          slidesPerView: 7,
          spaceBetween: 70,
        },
      },
    });

    // Initialize Swiper Products
    swiperProductsRef.current = new Swiper('.swiper-products .swiper', {
      modules: [Pagination, Autoplay],
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 7000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'progressbar',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
      },
    });

    // Initialize Swiper Services
    swiperServicesRef.current = new Swiper('.swiper-services', {
      modules: [Navigation],
      spaceBetween: 1,
      slidesPerView: 3,
      centeredSlides: true,
      roundLengths: true,
      loop: true,
      loopAdditionalSlides: 30,
      grabCursor: true,
      navigation: {
        nextEl: '.swiper-services-button-next',
        prevEl: '.swiper-services-button-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
      },
    });

    // Initialize Swiper Products Featured
    swiperProductsFeaturedRef.current = new Swiper('.swiper-products-featured', {
      modules: [Navigation, Autoplay],
      autoplay: {
        delay: 7000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-products-featured-button-next',
        prevEl: '.swiper-products-featured-button-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1280: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },
    });

    return () => {
      if (swiperSlidersRef.current) swiperSlidersRef.current.destroy();
      if (swiperBrandsRef.current) swiperBrandsRef.current.destroy();
      if (swiperProductsRef.current) swiperProductsRef.current.destroy();
      if (swiperServicesRef.current) swiperServicesRef.current.destroy();
      if (swiperProductsFeaturedRef.current) swiperProductsFeaturedRef.current.destroy();
    };
  }, []);

  return (
    <div className="wrapper">
      {/* Slider Section */}
      <section className="py-0 w-full sectionSlider sectionSliderIndex">
        <div className="swiper swiper-sliders w-full max-w-semifull h-72 md:h-80 lg:h-100 xl:h-104 2xl:h-107 rounded-2xl relative">
          <div className="swiper-wrapper">
            <div className="swiper-slide flex items-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/slider1.png)' }}>
              <div className="w-full relative z-20 px-20">
                <h2 className="text-white font-bold w-full text-xl leading-snug text-center sm:text-xl sm:leading-snug md:text-2xl md:leading-snug lg:text-left lg:text-3xl lg:leading-snug lg:w-8/12 xl:text-4xl xl:leading-snug 2xl:text-5x2l 2xl:leading-snug">
                  Soluciones integrales de ingeniería oleohidráulica que garantizan productividad y seguridad.
                </h2>
              </div>
              <div className="absolute z-10 w-full h-full left-0 top-0 bg-black bg-opacity-25"></div>
            </div>
            <div className="swiper-slide flex items-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/slider2.png)' }}>
              <div className="w-full relative z-20 px-20">
                <h2 className="text-white font-bold w-full text-xl leading-snug text-center sm:text-xl sm:leading-snug md:text-2xl md:leading-snug lg:text-left lg:text-3xl lg:leading-snug lg:w-8/12 xl:text-4xl xl:leading-snug 2xl:text-5x2l 2xl:leading-snug">
                  Servicios de calidad con respaldo y garantía de fabricantes líderes del rubro.
                </h2>
              </div>
              <div className="absolute z-10 w-full h-full left-0 top-0 bg-black bg-opacity-25"></div>
            </div>
            <div className="swiper-slide flex items-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/slider3.png)' }}>
              <div className="w-full relative z-20 px-20">
                <h2 className="text-white font-bold w-full text-xl leading-snug text-center sm:text-xl sm:leading-snug md:text-2xl md:leading-snug lg:text-left lg:text-3xl lg:leading-snug lg:w-8/12 xl:text-4xl xl:leading-snug 2xl:text-5x2l 2xl:leading-snug">
                  Amplio stock y reposición adecuada de equipamiento original.
                </h2>
              </div>
              <div className="absolute z-10 w-full h-full left-0 top-0 bg-black bg-opacity-25"></div>
            </div>
          </div>
          <div className="slider-button-prev absolute left-7 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer">
            <i className="las la-angle-left text-white text-4xl"></i>
          </div>
          <div className="slider-button-next absolute right-7 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer">
            <i className="las la-angle-right text-white text-4xl"></i>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="bg-white py-10 lg:py-16 xl:py-20 2xl:py-24">
        <Container>
          <p className="subtitle mb-2 lg:mb-3 2xl:mb-5">NUESTRAS MARCAS</p>
          <h2 className="title mb-3 lg:mb-3 xl:mb-5">Somos distribuidores autorizados</h2>
          <p className="mb-14 xl:mb-16 2xl:mb-20">
            Ponemos a su disposición equipos oleohidráulicos de marcas reconocidas en el mercado global.
          </p>
          <div className="w-full relative">
            <div className="swiper swiper-brands m-auto">
              <div className="swiper-wrapper">
                <div className="swiper-slide flex justify-center group">
                  <img src="/images/brands/brand1.png" alt="Marca 1" className="h-16 w-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="swiper-slide flex justify-center group">
                  <img src="/images/brands/brand2.png" alt="Marca 2" className="h-16 w-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="swiper-slide flex justify-center group">
                  <img src="/images/brands/brand3.png" alt="Marca 3" className="h-16 w-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="swiper-slide flex justify-center group">
                  <img src="/images/brands/brand4.png" alt="Marca 4" className="h-16 w-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="swiper-slide flex justify-center group">
                  <img src="/images/brands/brand5.png" alt="Marca 5" className="h-16 w-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="swiper-slide flex justify-center group">
                  <img src="/images/brands/brand6.png" alt="Marca 6" className="h-16 w-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="swiper-slide flex justify-center group">
                  <img src="/images/brands/brand7.png" alt="Marca 7" className="h-16 w-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="swiper-slide flex justify-center group">
                  <img src="/images/brands/brand8.png" alt="Marca 8" className="h-16 w-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
            <div className="courusel-button-prev absolute left-0 sm:-left-10 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer hover:opacity-70 transition-opacity">
              <i className="las la-angle-left text-gray-600 text-3xl"></i>
            </div>
            <div className="courusel-button-next absolute right-0 sm:-right-10 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer hover:opacity-70 transition-opacity">
              <i className="las la-angle-right text-gray-600 text-3xl"></i>
            </div>
          </div>
        </Container>
      </section>

      {/* Products Section */}
      <section className="bg-gradient-to-r from-grad-primary to-grad-secondary py-10 lg:py-16 xl:py-20 2xl:py-24 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-14">
            <div className="col-span-1 mb-14 md:mb-20 lg:mb-0 lg:col-span-3 flex items-center">
              <div>
                <p className="subtitle mb-2 lg:mb-3 2xl:mb-5">NUESTROS PRODUCTOS</p>
                <h2 className="title mb-3 lg:mb-3 xl:mb-5">Productos de alta calidad</h2>
                <p className="text-white mb-8">
                  Contamos con una amplia variedad de productos oleohidráulicos para satisfacer todas tus necesidades industriales.
                </p>
                <a href="/servicios" className="inline-block bg-orange-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
                  Ver más
                </a>
              </div>
            </div>
            <div className="col-span-1 lg:col-span-7 relative swiper-products">
              <div className="swiper w-full">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="bg-white rounded-xl p-6 h-full">
                      <img src="/images/products/product1.jpg" alt="Producto 1" className="w-full h-48 object-cover rounded-lg mb-4" />
                      <h3 className="font-bold text-lg mb-2">Bombas Hidráulicas</h3>
                      <p className="text-gray-600 text-sm">Bombas de alta eficiencia para aplicaciones industriales.</p>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="bg-white rounded-xl p-6 h-full">
                      <img src="/images/products/product2.jpg" alt="Producto 2" className="w-full h-48 object-cover rounded-lg mb-4" />
                      <h3 className="font-bold text-lg mb-2">Válvulas</h3>
                      <p className="text-gray-600 text-sm">Válvulas de control y dirección de precisión.</p>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="bg-white rounded-xl p-6 h-full">
                      <img src="/images/products/product3.jpg" alt="Producto 3" className="w-full h-48 object-cover rounded-lg mb-4" />
                      <h3 className="font-bold text-lg mb-2">Cilindros</h3>
                      <p className="text-gray-600 text-sm">Cilindros hidráulicos de alta resistencia.</p>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="bg-white rounded-xl p-6 h-full">
                      <img src="/images/products/product4.jpg" alt="Producto 4" className="w-full h-48 object-cover rounded-lg mb-4" />
                      <h3 className="font-bold text-lg mb-2">Filtros</h3>
                      <p className="text-gray-600 text-sm">Sistemas de filtración para mantener la pureza del fluido.</p>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="bg-white rounded-xl p-6 h-full">
                      <img src="/images/products/product5.jpg" alt="Producto 5" className="w-full h-48 object-cover rounded-lg mb-4" />
                      <h3 className="font-bold text-lg mb-2">Accesorios</h3>
                      <p className="text-gray-600 text-sm">Accesorios y componentes complementarios.</p>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div className="bg-white rounded-xl p-6 h-full">
                      <img src="/images/products/product6.jpg" alt="Producto 6" className="w-full h-48 object-cover rounded-lg mb-4" />
                      <h3 className="font-bold text-lg mb-2">Mangueras</h3>
                      <p className="text-gray-600 text-sm">Mangueras hidráulicas de alta presión.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="swiper-pagination mt-8"></div>
            </div>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="bg-white py-10 lg:py-16 xl:py-20 2xl:py-24">
        <Container>
          <p className="subtitle mb-2 lg:mb-3 2xl:mb-5">NUESTROS SERVICIOS</p>
          <h2 className="title mb-3 lg:mb-3 xl:mb-5">Capacidad y experiencia en soluciones oleohidráulicas de calidad.</h2>
          <p className="mb-14 xl:mb-16 2xl:mb-20">
            Contamos con el mejor equipo de profesionales capacitados para idear y diseñar la mejor solución a sus sistemas oleohidráulicos.
          </p>
        </Container>
        <div className="w-full overflow-hidden px-5 lg:px-0">
          <div className="swiper swiper-services w-full lg:w-166/1000 lg:-left-1/3 px-7 lg:px-0 relative">
            <div className="swiper-wrapper">
              <a href="/servicios/soporte-tecnico-in-situ" className="swiper-slide group">
                <img className="w-full rounded-xl" src="/images/services/service1.jpg" alt="Soporte Técnico In Situ" />
                <div className="lg:bg-orange-10 bottom-0 relative rounded-xl px-4 py-4 lg:py-7 lg:px-10 lg:absolute lg:-right-7 lg:bottom-10 xl:bottom-16 xl:py-10 xl:px-14">
                  <h3 className="font-bold text-lg lg:text-xl xl:text-2xl mb-2 lg:text-white group-hover:text-orange-primary transition-colors">
                    Soporte Técnico In Situ
                  </h3>
                  <p className="text-sm lg:text-white hidden lg:block">
                    Asistencia técnica especializada en su ubicación
                  </p>
                </div>
              </a>
              <a href="/servicios/diseno-y-consultoria" className="swiper-slide group">
                <img className="w-full rounded-xl" src="/images/services/service2.jpg" alt="Diseño y Consultoría" />
                <div className="lg:bg-orange-10 bottom-0 relative rounded-xl px-4 py-4 lg:py-7 lg:px-10 lg:absolute lg:-right-7 lg:bottom-10 xl:bottom-16 xl:py-10 xl:px-14">
                  <h3 className="font-bold text-lg lg:text-xl xl:text-2xl mb-2 lg:text-white group-hover:text-orange-primary transition-colors">
                    Diseño y Consultoría
                  </h3>
                  <p className="text-sm lg:text-white hidden lg:block">
                    Soluciones personalizadas para sus proyectos
                  </p>
                </div>
              </a>
              <a href="/servicios/fabricacion-de-sistemas" className="swiper-slide group">
                <img className="w-full rounded-xl" src="/images/services/service3.jpg" alt="Fabricación de Sistemas" />
                <div className="lg:bg-orange-10 bottom-0 relative rounded-xl px-4 py-4 lg:py-7 lg:px-10 lg:absolute lg:-right-7 lg:bottom-10 xl:bottom-16 xl:py-10 xl:px-14">
                  <h3 className="font-bold text-lg lg:text-xl xl:text-2xl mb-2 lg:text-white group-hover:text-orange-primary transition-colors">
                    Fabricación de Sistemas
                  </h3>
                  <p className="text-sm lg:text-white hidden lg:block">
                    Sistemas oleohidráulicos a medida
                  </p>
                </div>
              </a>
              <a href="/servicios/control-y-automatizacion" className="swiper-slide group">
                <img className="w-full rounded-xl" src="/images/services/service4.jpg" alt="Control y Automatización" />
                <div className="lg:bg-orange-10 bottom-0 relative rounded-xl px-4 py-4 lg:py-7 lg:px-10 lg:absolute lg:-right-7 lg:bottom-10 xl:bottom-16 xl:py-10 xl:px-14">
                  <h3 className="font-bold text-lg lg:text-xl xl:text-2xl mb-2 lg:text-white group-hover:text-orange-primary transition-colors">
                    Control y Automatización
                  </h3>
                  <p className="text-sm lg:text-white hidden lg:block">
                    Sistemas de control avanzados
                  </p>
                </div>
              </a>
              <a href="/servicios/fabricacion-de-piezas-a-medida" className="swiper-slide group">
                <img className="w-full rounded-xl" src="/images/services/service5.jpg" alt="Fabricación de Piezas a Medida" />
                <div className="lg:bg-orange-10 bottom-0 relative rounded-xl px-4 py-4 lg:py-7 lg:px-10 lg:absolute lg:-right-7 lg:bottom-10 xl:bottom-16 xl:py-10 xl:px-14">
                  <h3 className="font-bold text-lg lg:text-xl xl:text-2xl mb-2 lg:text-white group-hover:text-orange-primary transition-colors">
                    Fabricación de Piezas a Medida
                  </h3>
                  <p className="text-sm lg:text-white hidden lg:block">
                    Componentes personalizados de precisión
                  </p>
                </div>
              </a>
              <a href="/servicios/suministro-e-instalacion-de-tuberias" className="swiper-slide group">
                <img className="w-full rounded-xl" src="/images/services/service6.jpg" alt="Suministro e Instalación de Tuberías" />
                <div className="lg:bg-orange-10 bottom-0 relative rounded-xl px-4 py-4 lg:py-7 lg:px-10 lg:absolute lg:-right-7 lg:bottom-10 xl:bottom-16 xl:py-10 xl:px-14">
                  <h3 className="font-bold text-lg lg:text-xl xl:text-2xl mb-2 lg:text-white group-hover:text-orange-primary transition-colors">
                    Suministro e Instalación de Tuberías
                  </h3>
                  <p className="text-sm lg:text-white hidden lg:block">
                    Instalación profesional de sistemas de tuberías
                  </p>
                </div>
              </a>
              <a href="/servicios/flushing-y-prueba-de-presion" className="swiper-slide group">
                <img className="w-full rounded-xl" src="/images/services/service7.jpg" alt="Flushing y Prueba de Presión" />
                <div className="lg:bg-orange-10 bottom-0 relative rounded-xl px-4 py-4 lg:py-7 lg:px-10 lg:absolute lg:-right-7 lg:bottom-10 xl:bottom-16 xl:py-10 xl:px-14">
                  <h3 className="font-bold text-lg lg:text-xl xl:text-2xl mb-2 lg:text-white group-hover:text-orange-primary transition-colors">
                    Flushing y Prueba de Presión
                  </h3>
                  <p className="text-sm lg:text-white hidden lg:block">
                    Limpieza y verificación de sistemas
                  </p>
                </div>
              </a>
              <a href="/servicios/servicio-de-mantenimiento" className="swiper-slide group">
                <img className="w-full rounded-xl" src="/images/services/service8.jpg" alt="Servicio de Mantenimiento" />
                <div className="lg:bg-orange-10 bottom-0 relative rounded-xl px-4 py-4 lg:py-7 lg:px-10 lg:absolute lg:-right-7 lg:bottom-10 xl:bottom-16 xl:py-10 xl:px-14">
                  <h3 className="font-bold text-lg lg:text-xl xl:text-2xl mb-2 lg:text-white group-hover:text-orange-primary transition-colors">
                    Servicio de Mantenimiento
                  </h3>
                  <p className="text-sm lg:text-white hidden lg:block">
                    Mantenimiento preventivo y correctivo
                  </p>
                </div>
              </a>
            </div>
            <div className="swiper-services-button-prev absolute left-0 xl:left-31 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer hover:opacity-70 transition-opacity">
              <i className="las la-angle-left text-gray-600 text-4xl"></i>
            </div>
            <div className="swiper-services-button-next absolute right-0 xl:right-31 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer hover:opacity-70 transition-opacity">
              <i className="las la-angle-right text-gray-600 text-4xl"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gradient-to-r from-grad-primary to-grad-secondary py-10 lg:py-16 xl:py-20 2xl:py-24">
        <Container>
          <p className="subtitle mb-2 lg:mb-3 2xl:mb-5">PRODUCTOS DESTACADOS</p>
          <h2 className="title mb-14 xl:mb-16 2xl:mb-20">Componentes Oleohidráulicos para cada necesidad.</h2>
          <div className="w-full relative">
            <div className="swiper swiper-products-featured">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="bg-white rounded-xl overflow-hidden group">
                    <div className="h-64 overflow-hidden">
                      <img src="/images/featured/featured1.jpg" alt="Producto Destacado 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2">Bomba Hidráulica de Pistones</h3>
                      <p className="text-gray-600 text-sm mb-4">Alta eficiencia y rendimiento</p>
                      <a href="#" className="text-orange-primary font-semibold hover:underline">Ver detalles →</a>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="bg-white rounded-xl overflow-hidden group">
                    <div className="h-64 overflow-hidden">
                      <img src="/images/featured/featured2.jpg" alt="Producto Destacado 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2">Válvula Direccional</h3>
                      <p className="text-gray-600 text-sm mb-4">Control preciso de flujo</p>
                      <a href="#" className="text-orange-primary font-semibold hover:underline">Ver detalles →</a>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="bg-white rounded-xl overflow-hidden group">
                    <div className="h-64 overflow-hidden">
                      <img src="/images/featured/featured3.jpg" alt="Producto Destacado 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2">Cilindro Hidráulico</h3>
                      <p className="text-gray-600 text-sm mb-4">Máxima resistencia y durabilidad</p>
                      <a href="#" className="text-orange-primary font-semibold hover:underline">Ver detalles →</a>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="bg-white rounded-xl overflow-hidden group">
                    <div className="h-64 overflow-hidden">
                      <img src="/images/featured/featured4.jpg" alt="Producto Destacado 4" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2">Sistema de Filtración</h3>
                      <p className="text-gray-600 text-sm mb-4">Pureza garantizada del fluido</p>
                      <a href="#" className="text-orange-primary font-semibold hover:underline">Ver detalles →</a>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="bg-white rounded-xl overflow-hidden group">
                    <div className="h-64 overflow-hidden">
                      <img src="/images/featured/featured5.jpg" alt="Producto Destacado 5" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2">Acumulador Hidráulico</h3>
                      <p className="text-gray-600 text-sm mb-4">Almacenamiento de energía eficiente</p>
                      <a href="#" className="text-orange-primary font-semibold hover:underline">Ver detalles →</a>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="bg-white rounded-xl overflow-hidden group">
                    <div className="h-64 overflow-hidden">
                      <img src="/images/featured/featured6.jpg" alt="Producto Destacado 6" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2">Manguera de Alta Presión</h3>
                      <p className="text-gray-600 text-sm mb-4">Resistencia extrema</p>
                      <a href="#" className="text-orange-primary font-semibold hover:underline">Ver detalles →</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-products-featured-button-prev absolute left-2 sm:-left-6 top-1/3 z-20 cursor-pointer hover:opacity-70 transition-opacity">
              <i className="las la-angle-left text-white text-4xl"></i>
            </div>
            <div className="swiper-products-featured-button-next absolute right-2 sm:-right-6 top-1/3 z-20 cursor-pointer hover:opacity-70 transition-opacity">
              <i className="las la-angle-right text-white text-4xl"></i>
            </div>
          </div>
        </Container>
      </section>

    
    </div>
  );
};

export default Inicio;

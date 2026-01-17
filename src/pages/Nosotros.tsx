import { useEffect, useRef } from "react";
import Swiper from "swiper";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import Container from "../components/common/Container";
import "../styles/Nosotros.css";

const values = [
  { label: "Responsabilidad", icon: "./Nosotros - Oleohidraulics Services S.A.C._files/541d006ae1849-4995.svg" },
  { label: "Compromiso", icon: "/icons/compromiso.svg" },
  { label: "Honestidad", icon: "/icons/honestidad.svg" },
  { label: "Integridad", icon: "/icons/integridad.svg" },
  { label: "Confianza", icon: "/icons/confianza.svg" },
  { label: "Trabajo en equipo", icon: "/icons/trabajo-equipo.svg" },
  { label: "Perseverancia", icon: "/icons/perseverancia.svg" },
  { label: "Dedicación", icon: "/icons/dedicacion.svg" },
];

const Nosotros = () => {
  const swiperRef = useRef<Swiper | null>(null);

  useEffect(() => {
    // Evita doble init en dev (React StrictMode)
    if (swiperRef.current) return;

    const instance = new Swiper(".swiper-galery", {
      modules: [Navigation, Autoplay, EffectFade],
      loop: true,

      effect: "fade",
      fadeEffect: { crossFade: true },

      autoplay: {
        delay: 7000,
        disableOnInteraction: false,
      },

      navigation: {
        nextEl: ".slider-button-next",
        prevEl: ".slider-button-prev",
      },
    });

    swiperRef.current = instance;

    return () => {
      swiperRef.current?.destroy(true, true);
      swiperRef.current = null;
    };
  }, []);

  return (
    <div className="nosotros">
      {/* HERO / QUIÉNES SOMOS */}
      <section className="nosotros-hero">
        <Container>
          <div className="nosotros-hero-grid">
            <div className="nosotros-hero-left">
            <p className="nosotros-subtitle" style={{ fontSize: "1.25rem", fontWeight: 900 }}>QUIÉNES SOMOS</p>

              <h1 className="nosotros-title">
                Especialistas en fabricación, mantenimiento y comercialización de equipos oleohidráulicos.
              </h1>

              <p className="nosotros-text">
                Oleohidraulics Services S.A.C. es una empresa con más de 14 años de experiencia en el
                mercado, especializada en mantenimiento, fabricación y comercialización de equipos y
                sistemas oleo-hidráulicos.
              </p>

              <p className="nosotros-text">
                Asimismo, contamos con servicios de mecanizado de precisión (CNC), área de diseño y
                proyectos especializados para planificar la mejor solución a sus problemas hidráulicos.
              </p>

              <ul className="nosotros-policies">
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    POLÍTICA SIG
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    POLÍTICA PREVENCIÓN DE LAVADO DE ACTIVOS Y FINANCIAMIENTO DEL TERRORISMO
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    POLÍTICA DE DERECHOS HUMANOS
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    POLÍTICA DE RESPONSABILIDAD SOCIAL EMPRESARIAL
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    POLÍTICA ANTICORRUPCIÓN Y ANTISOBORNO
                  </a>
                </li>
              </ul>
            </div>

            <div className="nosotros-hero-right">
              <div className="nosotros-slider">
                <div className="swiper swiper-galery">
                  <div className="swiper-wrapper">
                    <div className="swiper-slide">
                      <img src="/images/img1.jpg" alt="Galería 1" />
                    </div>
                    <div className="swiper-slide">
                      <img src="/images/img2.jpg" alt="Galería 2" />
                    </div>
                    <div className="swiper-slide">
                      <img src="/images/img3.jpg" alt="Galería 3" />
                    </div>
                  </div>
                </div>

                {/* Flechas como en tu captura */}
                <button type="button" className="slider-button-prev" aria-label="Anterior">
                  ‹
                </button>
                <button type="button" className="slider-button-next" aria-label="Siguiente">
                  ›
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* MISIÓN / VISIÓN */}
      <section className="nosotros-mv">
        <Container>
          <div className="nosotros-mv-card">
            <div className="nosotros-mv-grid">
              <div>
                <h2>Nuestra Misión</h2>
                <p>
                  Brindar SOLUCIONES a las necesidades y expectativas de nuestros clientes, ofreciéndoles
                  resultados rápidos y de calidad. A su vez garantizando eficacia, eficiencia y
                  efectividad en la entrega de nuestros servicios.
                </p>
              </div>

              <div>
                <h2>Nuestra Visión</h2>
                <p>
                  Llegar a ser una empresa líder a nivel nacional en el campo Oleo hidráulico, buscando
                  siempre la mejor solución de acorde a las necesidades de nuestros clientes.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* VALORES */}
      <section className="nosotros-values">
        <Container>
          <h2 className="nosotros-values-title">Nuestros valores</h2>

          <div className="nosotros-values-grid">
            {values.map((v) => (
              <div key={v.label} className="nosotros-value-item">
                <div className="nosotros-value-icon">
                  <img src={v.icon} alt={v.label} />
                </div>
                <p>{v.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Nosotros;

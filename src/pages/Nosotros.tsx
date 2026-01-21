import { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import Container from "../components/common/Container";
import { listarEmpresas } from "../services/empresa/Empresa"; // Ajusta la ruta según tu estructura
import type { Empresa } from "../interfaces/empresa/Empresa"; // Ajusta la ruta según tu estructura
import "../styles/Nosotros.css";

const values = [
  { label: "Responsabilidad", icon: "/home/responsabilidad.svg" },
  { label: "Compromiso", icon: "/home/compromiso.svg" },
  { label: "Honestidad", icon: "/home/honestidad.svg" },
  { label: "Integridad", icon: "/home/integridad.svg" },
  { label: "Confianza", icon: "/home/confianza.svg" },
  { label: "Trabajo en equipo", icon: "/home/teamwork.svg" },
  { label: "Perseverancia", icon : "/home/perseverancia.svg" },
  { label: "Dedicación", icon: "/home/dedicacion.svg" },
];

const Nosotros = () => {
  const swiperRef = useRef<Swiper | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const empresas = await listarEmpresas();
        if (empresas.length > 0) {
          setEmpresa(empresas[0]); // Tomar la primera empresa
        }
      } catch (error) {
        console.error("Error al cargar datos de la empresa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, []);

  useEffect(() => {
    // Evita doble init en dev (React StrictMode)
     if (loading || swiperRef.current) return;

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
  }, [loading]);

  if (loading) {
    return <div>Cargando...</div>;
  }

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
                {empresa?.nosotros || "Información no disponible"}
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
                  {empresa?.mision || "Información no disponible"}
                </p>
              </div>

              <div>
                <h2>Nuestra Visión</h2>
                <p>
                  {empresa?.vision || "Información no disponible"}
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
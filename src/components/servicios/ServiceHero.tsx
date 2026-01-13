// src/components/servicios/ServiceHero.tsx
import React, { useEffect, useRef } from "react";
import Swiper from "swiper";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

interface ServiceHeroProps {
	images: string[];
}

const ServiceHero: React.FC<ServiceHeroProps> = ({ images }) => {
	const swiperRef = useRef<Swiper | null>(null);

	useEffect(() => {
		if (images.length > 0) {
			swiperRef.current = new Swiper(".swiper-sliders", {
				modules: [EffectFade, Autoplay],
				loop: true,
				effect: "fade",
				fadeEffect: {
					crossFade: true,
				},
				autoplay: {
					delay: 7000,
					disableOnInteraction: false,
				},
			});
		}

		return () => {
			if (swiperRef.current) {
				swiperRef.current.destroy();
			}
		};
	}, [images]);

	return (
		<section className="pt-4 pb-0 w-full">
			<div className="container">
				<div className="swiper swiper-sliders w-full h-24 sm:h-48 md:h-60 lg:h-72 xl:h-88 2xl:h-98 rounded-2xl overflow-hidden">
					<div className="swiper-wrapper">
						{images.map((image, index) => (
							<div
								key={index}
								className="swiper-slide bg-cover bg-center bg-no-repeat"
								style={{ backgroundImage: `url(${image})` }}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default ServiceHero;



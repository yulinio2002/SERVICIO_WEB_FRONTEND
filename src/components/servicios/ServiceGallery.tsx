// src/components/servicios/ServiceGallery.tsx
import React, { useEffect, useRef } from "react";
import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import type { GalleryImage } from "@interfaces/servicio/Service.ts";

interface ServiceGalleryProps {
	images: GalleryImage[];
}

const ServiceGallery: React.FC<ServiceGalleryProps> = ({ images }) => {
	const swiperRef = useRef<Swiper | null>(null);

	useEffect(() => {
		if (images.length > 0) {
			swiperRef.current = new Swiper(".swiper-gallery", {
				modules: [Navigation],
				slidesPerView: 1,
				spaceBetween: 40,
				navigation: {
					nextEl: ".swiper-gallery-button-next",
					prevEl: ".swiper-gallery-button-prev",
				},
				breakpoints: {
					640: {
						slidesPerView: 2,
						spaceBetween: 40,
					},
					1024: {
						slidesPerView: 3,
						spaceBetween: 40,
					},
					1280: {
						slidesPerView: 3,
						spaceBetween: 70,
					},
				},
			});
		}

		return () => {
			if (swiperRef.current) {
				swiperRef.current.destroy();
			}
		};
	}, [images]);

	if (images.length === 0) {
		return null;
	}

	return (
		<section className="bg-white pt-10 md:pt-0">
			<div className="container">
				<p className="mt-8 mb-8 text-left font-extrabold tracking-tight text-1xl sm:text-2xl lg:text-3xl mx-auto">
					Galería de fotos
				</p>
				<div className="w-full relative">
					<div className="swiper swiper-gallery">
						<div className="swiper-wrapper">
							{images.map((image) => (
								<div key={image.id} className="swiper-slide">
									<div className="cursor-pointer">
										<img
											src={image.url}
											alt={image.alt}
											className="rounded-3xl w-full h-64 object-cover"
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Navigation Buttons */}
					<button
						className="swiper-gallery-button-prev absolute -left-6 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
						aria-label="Previous slide"
					>
						<i className="las la-angle-left text-2xl"></i>
					</button>
					<button
						className="swiper-gallery-button-next absolute -right-6 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
						aria-label="Next slide"
					>
						<i className="las la-angle-right text-2xl"></i>
					</button>
				</div>
			</div>
		</section>
	);
};

export default ServiceGallery;

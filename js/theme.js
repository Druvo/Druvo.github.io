(function($) {
	'use strict';

	var nav_offset_top = $('header').height() + 50;
	/*-------------------------------------------------------------------------------
	  Navbar 
	-------------------------------------------------------------------------------*/

	//* Navbar Fixed
	function navbarFixed() {
		if ($('.header_area').length) {
			$(window).scroll(function() {
				var scroll = $(window).scrollTop();
				if (scroll >= nav_offset_top) {
					$('.header_area').addClass('navbar_fixed');
				} else {
					$('.header_area').removeClass('navbar_fixed');
				}
			});
		}
	}
	navbarFixed();

	/*----------------------------------------------------*/
	/*  MailChimp Slider
    /*----------------------------------------------------*/
	function mailChimp() {
		$('#mc_embed_signup').find('form').ajaxChimp();
	}
	mailChimp();

	$('select').niceSelect();
	/* ---------------------------------------------
            Isotope js Starts
         --------------------------------------------- */
	$(window).on('load', function() {
		$('.portfolio-filter ul li').on('click', function() {
			$('.portfolio-filter ul li').removeClass('active');
			$(this).addClass('active');

			var data = $(this).attr('data-filter');
			$workGrid.isotope({
				filter: data
			});
		});

		if (document.getElementById('portfolio')) {
			var $workGrid = $('.portfolio-grid').isotope({
				itemSelector: '.all',
				percentPosition: true,
				masonry: {
					columnWidth: '.all'
				}
			});
		}
	});

	/*----------------------------------------------------*/
	/* Start Magnific Pop Up
	/*----------------------------------------------------*/
	if ($('.img-gal').length > 0) {
		$('.img-gal').magnificPopup({
			type: 'image',
			gallery: {
				enabled: true
			}
		});
	}
	/*----------------------------------------------------*/
	/*  End  Magnific Pop Up
	/*----------------------------------------------------*/

	/*----------------------------------------------------*/
	/*  Testimonials Slider
    /*----------------------------------------------------*/
	function testimonials_slider() {
		if ($('.testi_slider').length) {
			$('.testi_slider').owlCarousel({
				loop: true,
				margin: 30,
				items: 2,
				autoplay: true,
				smartSpeed: 2500,
				dots: true,
				responsiveClass: true,
				responsive: {
					0: {
						items: 1
					},
					991: {
						items: 2
					}
				}
			});
		}
	}
	testimonials_slider();

	/*----------------------------------------------------*/
	/*  Google map js
    /*----------------------------------------------------*/

	if ($('#mapBox').length) {
		var $lat = $('#mapBox').data('lat');
		var $lon = $('#mapBox').data('lon');
		var $zoom = $('#mapBox').data('zoom');
		var $marker = $('#mapBox').data('marker');
		var $info = $('#mapBox').data('info');
		var $markerLat = $('#mapBox').data('mlat');
		var $markerLon = $('#mapBox').data('mlon');
		var map = new GMaps({
			el: '#mapBox',
			lat: $lat,
			lng: $lon,
			scrollwheel: false,
			scaleControl: true,
			streetViewControl: false,
			panControl: true,
			disableDoubleClickZoom: true,
			mapTypeControl: false,
			zoom: $zoom,
			styles: [
				{
					featureType: 'water',
					elementType: 'geometry.fill',
					stylers: [
						{
							color: '#dcdfe6'
						}
					]
				},
				{
					featureType: 'transit',
					stylers: [
						{
							color: '#808080'
						},
						{
							visibility: 'off'
						}
					]
				},
				{
					featureType: 'road.highway',
					elementType: 'geometry.stroke',
					stylers: [
						{
							visibility: 'on'
						},
						{
							color: '#dcdfe6'
						}
					]
				},
				{
					featureType: 'road.highway',
					elementType: 'geometry.fill',
					stylers: [
						{
							color: '#ffffff'
						}
					]
				},
				{
					featureType: 'road.local',
					elementType: 'geometry.fill',
					stylers: [
						{
							visibility: 'on'
						},
						{
							color: '#ffffff'
						},
						{
							weight: 1.8
						}
					]
				},
				{
					featureType: 'road.local',
					elementType: 'geometry.stroke',
					stylers: [
						{
							color: '#d7d7d7'
						}
					]
				},
				{
					featureType: 'poi',
					elementType: 'geometry.fill',
					stylers: [
						{
							visibility: 'on'
						},
						{
							color: '#ebebeb'
						}
					]
				},
				{
					featureType: 'administrative',
					elementType: 'geometry',
					stylers: [
						{
							color: '#a7a7a7'
						}
					]
				},
				{
					featureType: 'road.arterial',
					elementType: 'geometry.fill',
					stylers: [
						{
							color: '#ffffff'
						}
					]
				},
				{
					featureType: 'road.arterial',
					elementType: 'geometry.fill',
					stylers: [
						{
							color: '#ffffff'
						}
					]
				},
				{
					featureType: 'landscape',
					elementType: 'geometry.fill',
					stylers: [
						{
							visibility: 'on'
						},
						{
							color: '#efefef'
						}
					]
				},
				{
					featureType: 'road',
					elementType: 'labels.text.fill',
					stylers: [
						{
							color: '#696969'
						}
					]
				},
				{
					featureType: 'administrative',
					elementType: 'labels.text.fill',
					stylers: [
						{
							visibility: 'on'
						},
						{
							color: '#737373'
						}
					]
				},
				{
					featureType: 'poi',
					elementType: 'labels.icon',
					stylers: [
						{
							visibility: 'off'
						}
					]
				},
				{
					featureType: 'poi',
					elementType: 'labels',
					stylers: [
						{
							visibility: 'off'
						}
					]
				},
				{
					featureType: 'road.arterial',
					elementType: 'geometry.stroke',
					stylers: [
						{
							color: '#d6d6d6'
						}
					]
				},
				{
					featureType: 'road',
					elementType: 'labels.icon',
					stylers: [
						{
							visibility: 'off'
						}
					]
				},
				{},
				{
					featureType: 'poi',
					elementType: 'geometry.fill',
					stylers: [
						{
							color: '#dadada'
						}
					]
				}
			]
		});
	}
})(jQuery);

// Portfolio Modal System
const projectData = {
    'gtopup': {
        title: 'Global Top-up Platform',
        image: 'img/portfolio/gtopup.jpg',
        description: 'A comprehensive multi-currency mobile recharge platform that enables users to top-up mobile phones across different countries and carriers. Features real-time API integration with multiple telecom providers, secure payment processing, and transaction history management.',
        techStack: ['ASP.NET Core', 'Web API', 'SQL Server', 'Payment Gateway', 'Real-time APIs'],
        features: [
            'Multi-currency support for international transactions',
            'Real-time API integration with telecom providers',
            'Secure payment gateway integration',
            'Transaction history and reporting',
            'User account management system',
            'Admin dashboard for monitoring and control'
        ],
        liveLink: 'http://gtopup.me',
        githubLink: ''
    },
    'transcom': {
        title: 'Transcom Digital E-commerce',
        image: 'img/portfolio/TranscomDigitalEcom.jpg',
        description: 'Enterprise-grade e-commerce platform built with nopCommerce framework. Features advanced inventory management, multi-vendor support, integrated payment systems, and comprehensive admin controls for managing products, orders, and customer relationships.',
        techStack: ['nopCommerce', 'ASP.NET Core', 'SQL Server', 'Payment Gateway', 'Azure'],
        features: [
            'Multi-vendor marketplace functionality',
            'Advanced inventory management system',
            'Integrated payment gateway solutions',
            'Customer relationship management',
            'Order processing and fulfillment',
            'Analytics and reporting dashboard'
        ],
        liveLink: 'https://transcomdigital.com/',
        githubLink: ''
    },
    'wasa-vms': {
        title: 'WASA Visitor Management System',
        image: 'img/portfolio/wasaVms.jpg',
        description: 'Enterprise visitor management system designed for WASA (Water and Sewerage Authority). Features biometric integration, real-time visitor tracking, security badge printing, and comprehensive reporting for administrative oversight.',
        techStack: ['WPF', 'C#', 'SQL Server', 'Biometric SDK', 'Crystal Reports'],
        features: [
            'Biometric fingerprint integration',
            'Real-time visitor tracking and monitoring',
            'Security badge printing system',
            'Visitor pre-registration functionality',
            'Comprehensive reporting and analytics',
            'Multi-level security access control'
        ],
        liveLink: '',
        githubLink: ''
    },
    'pm-fellowship': {
        title: 'PM Fellowship Portal',
        image: 'img/portfolio/PMFellow.jpg',
        description: 'Government fellowship management portal for the Prime Minister\'s Office of Bangladesh. Handles fellowship applications, evaluation processes, document management, and administrative workflows for the PM Fellowship program.',
        techStack: ['Django', 'Python', 'PostgreSQL', 'Redis', 'Celery'],
        features: [
            'Online fellowship application system',
            'Document upload and verification',
            'Multi-stage evaluation process',
            'Email notification system',
            'Administrative dashboard',
            'Reporting and analytics module'
        ],
        liveLink: 'https://pmfellowship.pmo.gov.bd/',
        githubLink: ''
    },
    'erp-sync': {
        title: 'ERP Data Synchronizer',
        image: 'img/portfolio/ERPSync.jpg',
        description: 'Automated data synchronization service that bridges multiple ERP systems. Provides real-time data exchange, conflict resolution, and maintains data integrity across different enterprise applications and databases.',
        techStack: ['Windows Service', 'C#', 'REST API', 'SQL Server', 'Message Queue'],
        features: [
            'Real-time data synchronization',
            'Multi-system integration capability',
            'Conflict resolution algorithms',
            'Data transformation and mapping',
            'Error handling and logging',
            'Scheduled synchronization tasks'
        ],
        liveLink: '',
        githubLink: ''
    },
    'po-fish': {
        title: 'PO Fish Market E-commerce',
        image: 'img/portfolio/POFishMarket.jpg',
        description: 'Specialized e-commerce platform for seafood marketplace. Features fresh product management, cold chain logistics integration, delivery scheduling, and quality assurance tracking for perishable goods.',
        techStack: ['Django', 'Python', 'PostgreSQL', 'Payment Integration', 'Logistics API'],
        features: [
            'Fresh product inventory management',
            'Cold chain logistics integration',
            'Delivery scheduling system',
            'Quality assurance tracking',
            'Payment gateway integration',
            'Customer order management'
        ],
        liveLink: 'http://pofishmarket.com/',
        githubLink: ''
    },
    'myteletalk': {
        title: 'MyTeletalk Integration Platform',
        image: 'img/portfolio/MyTeletalk.jpg',
        description: 'Telecom service integration platform that connects with Teletalk\'s systems for various services including mobile recharge, bill payment, and account management. Features real-time API communication and service orchestration.',
        techStack: ['Django', 'Python', 'API Integration', 'Real-time Processing', 'Redis'],
        features: [
            'Real-time telecom API integration',
            'Mobile recharge services',
            'Bill payment processing',
            'Account management system',
            'Transaction monitoring',
            'Service status tracking'
        ],
        liveLink: '',
        githubLink: ''
    },
    'wasa-admin': {
        title: 'WASA Administrative System',
        image: 'img/portfolio/WASAvmsAdmin.jpg',
        description: 'Comprehensive administrative dashboard for WASA operations. Provides REST API backend services, data management, reporting capabilities, and system administration tools for water and sewerage management.',
        techStack: ['Django', 'Django REST Framework', 'PostgreSQL', 'Admin Panel', 'API Documentation'],
        features: [
            'RESTful API backend services',
            'Comprehensive admin dashboard',
            'Data management and reporting',
            'User role and permission management',
            'System monitoring and logging',
            'API documentation and testing'
        ],
        liveLink: '',
        githubLink: ''
    },
    'personal-wp': {
        title: 'Personal WordPress Portfolio',
        image: 'img/portfolio/PersonalWPSite.jpg',
        description: 'Custom WordPress portfolio website with responsive design, custom theme development, and modern UI/UX. Features blog functionality, portfolio showcase, and contact integration.',
        techStack: ['WordPress', 'PHP', 'Custom Theme', 'Responsive Design', 'MySQL'],
        features: [
            'Custom WordPress theme development',
            'Responsive design for all devices',
            'Portfolio showcase functionality',
            'Blog and content management',
            'Contact form integration',
            'SEO optimization features'
        ],
        liveLink: '',
        githubLink: ''
    }
};

function openProjectModal(projectId) {
    const project = projectData[projectId];
    if (!project) return;

    // Populate modal content
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalImage').alt = project.title;
    document.getElementById('modalDescription').textContent = project.description;

    // Populate tech stack
    const techStackContainer = document.getElementById('modalTechStack');
    techStackContainer.innerHTML = '';
    project.techStack.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = tech;
        techStackContainer.appendChild(span);
    });

    // Populate features
    const featuresContainer = document.getElementById('modalFeatures');
    featuresContainer.innerHTML = '';
    project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresContainer.appendChild(li);
    });

    // Handle project links
    const liveLink = document.getElementById('modalLiveLink');
    const githubLink = document.getElementById('modalGithubLink');

    if (project.liveLink) {
        liveLink.href = project.liveLink;
        liveLink.style.display = 'inline-flex';
    } else {
        liveLink.style.display = 'none';
    }

    if (project.githubLink) {
        githubLink.href = project.githubLink;
        githubLink.style.display = 'inline-flex';
    } else {
        githubLink.style.display = 'none';
    }

    // Show modal
    document.getElementById('projectModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) {
        closeProjectModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeProjectModal();
    }
});

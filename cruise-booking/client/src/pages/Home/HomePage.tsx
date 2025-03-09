import { Link } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel';
import LazyImage from '../../components/Common/LazyImage';

export default function HomePage() {
  const carouselImages = [
    {
      url: '/images/Cards/big-luxurious-cruise-ship-docked-nice-harbor-ai-generative.jpg',
      title: 'Your Dream Cruise Vacation Awaits',
      description: 'Explore the world\'s most beautiful destinations with our luxury cruise packages.'
    },
    {
      url: '/images/Cards/side-view-breakfast-with-baked-grape-omelette-white-plate-balc-ony-by-sea.jpg',
      title: 'Experience Luxury at Sea',
      description: 'Indulge in world-class dining and amenities while cruising to exotic destinations.'
    },
    {
      url: '/images/Cards/red-boat-water-beside-ice-berg.jpg',
      title: 'Adventure Awaits',
      description: 'Discover breathtaking landscapes and unforgettable experiences on our cruise journeys.'
    }
  ];

  const destinations = [
    { 
      id: 'mediterranean-explorer',
      name: 'Mediterranean',
      image: '/images/Cards/side-view-breakfast-with-baked-grape-omelette-white-plate-balc-ony-by-sea.jpg'
    },
    { 
      id: 'caribbean-paradise',
      name: 'Caribbean',
      image: '/images/Cards/big-luxurious-cruise-ship-docked-nice-harbor-ai-generative.jpg'
    },
    { 
      id: 'alaska-adventure',
      name: 'Alaska',
      image: '/images/Cards/red-boat-water-beside-ice-berg.jpg'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section with Carousel */}
      <section>
        <Carousel images={carouselImages} />
      </section>

      {/* Featured Destinations */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <LazyImage 
                src={destination.image} 
                alt={`${destination.name} Cruise`} 
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{destination.name} Cruises</h3>
                <p className="text-gray-600 mb-4">
                  Experience the beauty of {destination.name} with our exclusive cruise packages.
                </p>
                <Link 
                  to={`/cruises/${destination.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Luxury Experience',
                description: 'Enjoy world-class amenities and service on our cruise ships.'
              },
              {
                title: 'Best Prices',
                description: 'We offer competitive prices and regular special deals.'
              },
              {
                title: '24/7 Support',
                description: 'Our customer support team is always here to help you.'
              }
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8">
            Book your cruise today and get exclusive early bird discounts.
          </p>
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

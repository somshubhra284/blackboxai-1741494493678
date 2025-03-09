import { useState } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../Common/LazyImage';

export default function CruiseList() {
  const [isMapView, setIsMapView] = useState(false);

  const cruises = [
    {
      id: 'mediterranean-explorer',
      name: 'Mediterranean Explorer',
      startPort: 'Barcelona',
      endPort: 'Rome',
      price: 1599,
      duration: '10 days',
      image: '/images/Cards/side-view-breakfast-with-baked-grape-omelette-white-plate-balc-ony-by-sea.jpg'
    },
    {
      id: 'caribbean-paradise',
      name: 'Caribbean Paradise',
      startPort: 'Miami',
      endPort: 'Nassau',
      price: 1299,
      duration: '7 days',
      image: '/images/Cards/big-luxurious-cruise-ship-docked-nice-harbor-ai-generative.jpg'
    },
    {
      id: 'alaska-adventure',
      name: 'Alaska Adventure',
      startPort: 'Vancouver',
      endPort: 'Seward',
      price: 1899,
      duration: '12 days',
      image: '/images/Cards/red-boat-water-beside-ice-berg.jpg'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Cruises</h1>
        <button
          onClick={() => setIsMapView(!isMapView)}
          className="btn bg-primary-600 text-white hover:bg-primary-700"
        >
          Switch to {isMapView ? 'List' : 'Map'} View
        </button>
      </div>

      {!isMapView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cruises.map((cruise) => (
            <div key={cruise.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/cruises/${cruise.id}`}>
                <LazyImage
                  src={cruise.image}
                  alt={cruise.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{cruise.name}</h2>
                <p className="text-gray-600 mb-4">
                  {cruise.startPort} → {cruise.endPort}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-primary-600 font-bold">
                    ${cruise.price} • {cruise.duration}
                  </p>
                  <Link
                    to={`/cruises/${cruise.id}`}
                    className="btn bg-primary-600 text-white hover:bg-primary-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Map View</h3>
            <p className="text-gray-600">
              Map view is temporarily disabled. Please use list view to browse cruises.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

import { useParams } from 'react-router-dom';
import LazyImage from '../../components/Common/LazyImage';

interface CruiseDetails {
  id: string;
  name: string;
  image: string;
  startPort: string;
  endPort: string;
  price: number;
  duration: string;
  description: string;
  itinerary: Array<{
    day: number;
    port: string;
    activities: string[];
  }>;
  amenities: string[];
  included: string[];
  highlights: string[];
  ship: {
    name: string;
    details: {
      capacity: string;
      crew: string;
      length: string;
      launched: string;
    };
    features: string[];
  };
  dining: {
    restaurants: Array<{
      name: string;
      description: string;
      cuisine: string;
    }>;
  };
}

const cruiseData: Record<string, CruiseDetails> = {
  "mediterranean-explorer": {
    id: "mediterranean-explorer",
    name: "Mediterranean Explorer",
    image: "/images/Cards/side-view-breakfast-with-baked-grape-omelette-white-plate-balc-ony-by-sea.jpg",
    startPort: "Barcelona",
    endPort: "Rome",
    price: 1599,
    duration: "10 days",
    description: "Embark on a luxurious journey through the Mediterranean's most enchanting ports. From the vibrant streets of Barcelona to the historic wonders of Rome, experience the best of Mediterranean culture, cuisine, and coastlines.",
    itinerary: [
      {
        day: 1,
        port: "Barcelona, Spain",
        activities: ["Embarkation", "Welcome Dinner", "Evening City Tour", "Visit La Sagrada Familia"]
      },
      {
        day: 2,
        port: "Provence (Marseille), France",
        activities: ["Wine Tasting Tour", "Local Market Visit", "French Cooking Class", "Visit Notre-Dame de la Garde"]
      },
      {
        day: 3,
        port: "Monte Carlo, Monaco",
        activities: ["Casino Visit", "Royal Palace Tour", "Coastal Drive", "Formula One Track Walk"]
      },
      {
        day: 4,
        port: "Florence/Pisa (Livorno), Italy",
        activities: ["Renaissance Art Tour", "Leaning Tower Visit", "Tuscan Wine Tasting", "Uffizi Gallery Tour"]
      },
      {
        day: 5,
        port: "Rome (Civitavecchia), Italy",
        activities: ["Vatican Tour", "Colosseum Visit", "Roman Forum Exploration", "Farewell Dinner"]
      }
    ],
    amenities: [
      "Premium All-Inclusive Dining",
      "Spa & Wellness Center",
      "Theater Shows & Entertainment",
      "Pool & Sundeck",
      "Fitness Center",
      "Casino",
      "Kids Club"
    ],
    included: [
      "Luxury Accommodation",
      "All Meals & Select Beverages",
      "Entertainment & Activities",
      "Port Charges & Taxes",
      "Fitness Center Access",
      "Room Service"
    ],
    highlights: [
      "Visit 5 UNESCO World Heritage Sites",
      "Exclusive Wine Tasting Events",
      "Gourmet Mediterranean Cuisine",
      "Cultural Performances",
      "Historic City Tours"
    ],
    ship: {
      name: "MSC Seashore",
      details: {
        capacity: "5,632 guests",
        crew: "1,648 crew members",
        length: "339 meters",
        launched: "2021"
      },
      features: [
        "Infinity Pool",
        "Glass-floored Bridge of Sighs",
        "MSC Yacht Club",
        "Panoramic aft elevators"
      ]
    },
    dining: {
      restaurants: [
        {
          name: "La Piazza",
          description: "Traditional Italian cuisine with modern twists",
          cuisine: "Italian"
        },
        {
          name: "Ocean Cay",
          description: "Fresh seafood and Mediterranean specialties",
          cuisine: "Seafood"
        }
      ]
    }
  },
  "caribbean-paradise": {
    id: "caribbean-paradise",
    name: "Caribbean Paradise",
    image: "/images/Cards/big-luxurious-cruise-ship-docked-nice-harbor-ai-generative.jpg",
    startPort: "Miami",
    endPort: "Nassau",
    price: 1299,
    duration: "7 days",
    description: "Experience the ultimate Caribbean getaway with pristine beaches, crystal-clear waters, and vibrant island culture. From Miami to Nassau, discover paradise at every port.",
    itinerary: [
      {
        day: 1,
        port: "Miami, Florida",
        activities: ["Embarkation", "Sail Away Party", "Welcome Dinner", "South Beach Tour"]
      },
      {
        day: 2,
        port: "Key West, Florida",
        activities: ["Historic District Tour", "Snorkeling", "Ernest Hemingway Home Visit", "Sunset Celebration"]
      },
      {
        day: 3,
        port: "At Sea",
        activities: ["Pool Games", "Spa Treatments", "Cooking Demonstration", "Evening Show"]
      },
      {
        day: 4,
        port: "Nassau, Bahamas",
        activities: ["Beach Excursion", "Atlantis Aquaventure", "Island Tour", "Local Market Visit"]
      },
      {
        day: 5,
        port: "Great Stirrup Cay",
        activities: ["Private Island Beach Day", "Water Sports", "BBQ Lunch", "Nature Walk"]
      }
    ],
    amenities: [
      "Multiple Restaurants & Bars",
      "Water Park",
      "Live Entertainment",
      "Sports Court",
      "Spa & Wellness Center",
      "Kids & Teens Programs",
      "Adults-Only Areas"
    ],
    included: [
      "Cabin Accommodation",
      "All Meals",
      "Entertainment",
      "Port Charges",
      "Basic Beverages",
      "Fitness Center Access"
    ],
    highlights: [
      "Private Island Experience",
      "Underwater Adventures",
      "Caribbean Cuisine",
      "Beach Activities",
      "Island Hopping"
    ],
    ship: {
      name: "Norwegian Escape",
      details: {
        capacity: "4,266 guests",
        crew: "1,733 crew members",
        length: "325.9 meters",
        launched: "2015"
      },
      features: [
        "Aqua Park",
        "Ropes Course",
        "The Haven by Norwegian®",
        "Waterfront Promenade"
      ]
    },
    dining: {
      restaurants: [
        {
          name: "Tropicana Room",
          description: "Main dining room with floor-to-ceiling windows",
          cuisine: "International"
        },
        {
          name: "Margaritaville at Sea",
          description: "Caribbean-inspired cuisine",
          cuisine: "Caribbean"
        }
      ]
    }
  },
  "alaska-adventure": {
    id: "alaska-adventure",
    name: "Alaska Adventure",
    image: "/images/Cards/red-boat-water-beside-ice-berg.jpg",
    startPort: "Vancouver",
    endPort: "Seward",
    price: 1899,
    duration: "12 days",
    description: "Discover the untamed beauty of Alaska's wilderness. Witness magnificent glaciers, spot diverse wildlife, and experience the rich culture of the Last Frontier.",
    itinerary: [
      {
        day: 1,
        port: "Vancouver, Canada",
        activities: ["Embarkation", "City Tour", "Welcome Dinner", "Stanley Park Visit"]
      },
      {
        day: 2,
        port: "Inside Passage",
        activities: ["Scenic Cruising", "Wildlife Watching", "Photography Workshop", "Naturalist Presentation"]
      },
      {
        day: 3,
        port: "Ketchikan",
        activities: ["Totem Pole Tour", "Salmon Fishing", "Rainforest Hike", "Native Cultural Show"]
      },
      {
        day: 4,
        port: "Juneau",
        activities: ["Mendenhall Glacier Visit", "Whale Watching", "Gold Panning", "Mount Roberts Tramway"]
      },
      {
        day: 5,
        port: "Skagway",
        activities: ["White Pass Railway", "Gold Rush History Tour", "Dog Sledding", "Klondike Summit"]
      }
    ],
    amenities: [
      "Observation Lounges",
      "Heated Indoor Pool",
      "Educational Programs",
      "Photography Studio",
      "Library",
      "Fitness Center",
      "Spa Services"
    ],
    included: [
      "Cabin Accommodation",
      "All Meals",
      "Educational Programs",
      "Port Charges",
      "Basic Beverages",
      "Onboard Activities"
    ],
    highlights: [
      "Glacier Bay National Park",
      "Wildlife Encounters",
      "Native Culture",
      "Scenic Cruising",
      "Natural Wonders"
    ],
    ship: {
      name: "Celebrity Solstice",
      details: {
        capacity: "2,850 guests",
        crew: "1,246 crew members",
        length: "315 meters",
        launched: "2008"
      },
      features: [
        "Lawn Club",
        "Solarium",
        "Glass-blowing Show",
        "Sky Observation Lounge"
      ]
    },
    dining: {
      restaurants: [
        {
          name: "Grand Epernay",
          description: "Main dining room with panoramic views",
          cuisine: "International"
        },
        {
          name: "Tuscan Grille",
          description: "Italian steakhouse with Alaskan seafood",
          cuisine: "Italian & Steakhouse"
        }
      ]
    }
  }
};

export default function CruiseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const cruise = id ? cruiseData[id] : null;

  if (!cruise) {
    return <div className="container mx-auto px-4 py-8">Cruise not found</div>;
  }

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <LazyImage
          src={cruise.image}
          alt={cruise.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4">{cruise.name}</h1>
              <p className="text-xl mb-2">
                {cruise.startPort} → {cruise.endPort}
              </p>
              <p className="text-xl">
                ${cruise.price} • {cruise.duration}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Overview</h2>
          <p className="text-lg text-gray-700">{cruise.description}</p>
        </section>

        {/* Ship Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Your Ship: {cruise.ship.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Ship Details</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Capacity: {cruise.ship.details.capacity}</li>
                <li>Crew: {cruise.ship.details.crew}</li>
                <li>Length: {cruise.ship.details.length}</li>
                <li>Launched: {cruise.ship.details.launched}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Ship Features</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {cruise.ship.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Dining */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Dining Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cruise.dining.restaurants.map((restaurant, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                <p className="text-gray-600 mb-2">{restaurant.description}</p>
                <p className="text-primary-600">Cuisine: {restaurant.cuisine}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Itinerary */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Itinerary</h2>
          <div className="space-y-6">
            {cruise.itinerary.map((day) => (
              <div key={day.day} className="border-l-4 border-primary-600 pl-4">
                <h3 className="text-xl font-semibold mb-2">
                  Day {day.day} - {day.port}
                </h3>
                <ul className="list-disc list-inside text-gray-700">
                  {day.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Amenities & Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section>
            <h2 className="text-3xl font-bold mb-6">Amenities</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {cruise.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6">What's Included</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {cruise.included.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Highlights */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Cruise Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cruise.highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg text-center"
              >
                <p className="text-gray-700">{highlight}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Book Now Button */}
        <div className="mt-12 text-center">
          <button className="btn bg-primary-600 text-white hover:bg-primary-700 px-12 py-4 text-lg">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

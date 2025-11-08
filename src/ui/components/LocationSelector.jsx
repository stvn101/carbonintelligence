import React from 'react';
import { MapPin } from 'lucide-react';

const australianLocations = [
  { id: 'sydney', name: 'Sydney', state: 'NSW', climateZone: 5 },
  { id: 'melbourne', name: 'Melbourne', state: 'VIC', climateZone: 6 },
  { id: 'brisbane', name: 'Brisbane', state: 'QLD', climateZone: 2 },
  { id: 'perth', name: 'Perth', state: 'WA', climateZone: 5 },
  { id: 'adelaide', name: 'Adelaide', state: 'SA', climateZone: 6 },
  { id: 'hobart', name: 'Hobart', state: 'TAS', climateZone: 8 },
  { id: 'darwin', name: 'Darwin', state: 'NT', climateZone: 1 },
  { id: 'canberra', name: 'Canberra', state: 'ACT', climateZone: 7 },
  { id: 'gold_coast', name: 'Gold Coast', state: 'QLD', climateZone: 2 },
  { id: 'newcastle', name: 'Newcastle', state: 'NSW', climateZone: 5 }
];

const LocationSelector = ({ selectedLocation, onLocationChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-gray-600" />
        <span className="font-semibold text-gray-800">Project Location</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {australianLocations.map(location => (
          <button
            key={location.id}
            onClick={() => onLocationChange({
              city: location.name,
              state: location.state.toLowerCase(),
              climateZone: location.climateZone
            })}
            className={`p-3 rounded-lg border-2 transition-colors ${
              selectedLocation?.city.toLowerCase() === location.name.toLowerCase()
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold">{location.name}</div>
            <div className="text-sm opacity-75">
              {location.state}, Zone {location.climateZone}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationSelector;

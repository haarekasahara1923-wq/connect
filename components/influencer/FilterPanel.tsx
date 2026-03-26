'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { INFLUENCER_CATEGORIES, TIER2_CITIES } from '@/types';

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get('minPrice')) || 500,
    Number(searchParams.get('maxPrice')) || 50000
  ]);
  const [selectedCities, setSelectedCities] = useState<string[]>(
    searchParams.getAll('city') || []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll('category') || []
  );

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (priceRange[0] > 500) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 50000) params.set('maxPrice', priceRange[1].toString());
    selectedCities.forEach(city => params.append('city', city));
    selectedCategories.forEach(cat => params.append('category', cat));
    
    router.push(`/influencers?${params.toString()}`);
  };

  const clearFilters = () => {
    setQ('');
    setPriceRange([500, 50000]);
    setSelectedCities([]);
    setSelectedCategories([]);
    router.push('/influencers');
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 h-8 px-2">Reset</Button>
      </div>

      <div className="space-y-8">
        {/* Search */}
        <div className="space-y-3">
          <Label className="font-semibold text-gray-700">Search Name</Label>
          <Input 
            placeholder="e.g. Rahul Sharma" 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <Label className="font-semibold text-gray-700">Categories</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
            {INFLUENCER_CATEGORIES.map(cat => (
              <div key={cat} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cat-${cat}`} 
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                />
                <label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer">
                  {cat}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Cities */}
        <div className="space-y-3">
          <Label className="font-semibold text-gray-700">Cities</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
            {TIER2_CITIES.slice(0, 10).map(city => (
              <div key={city} className="flex items-center space-x-2">
                <Checkbox 
                  id={`city-${city}`} 
                  checked={selectedCities.includes(city)}
                  onCheckedChange={() => toggleCity(city)}
                />
                <label htmlFor={`city-${city}`} className="text-sm font-medium leading-none capitalize cursor-pointer">
                  {city}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price slider placeholder since Slider needs setup */}
        <div className="space-y-3">
          <Label className="font-semibold text-gray-700">Price Range (₹)</Label>
          <div className="flex items-center gap-2">
            <Input type="number" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-full text-center" />
            <span>-</span>
            <Input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full text-center" />
          </div>
        </div>

        <Button onClick={applyFilters} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

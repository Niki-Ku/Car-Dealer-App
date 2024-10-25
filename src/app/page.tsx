'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// TODO:
//

interface VehicleMake {
  MakeId: number;
  MakeName: string;
}

export default function Home() {
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2015 + 1 },
    (_, i) => currentYear - i
  );

  const isNextEnabled = selectedMake !== '' && selectedYear !== '';

  const fetchCarData = async () => {
    const response = await (
      await fetch(
        'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
      )
    ).json();
    setMakes(response.Results || []);
  };
  useEffect(() => {
    fetchCarData();
  }, []);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <form>
            <select
              className="bg-white text-black p-3"
              onChange={(e) => setSelectedMake(e.target.value)}
              value={selectedMake}
            >
              <option value="">Select Vehicle Make</option>
              {makes.map((make) => (
                <option key={make.MakeId} value={make.MakeId}>
                  {make.MakeName}
                </option>
              ))}
            </select>

            <select
              className="bg-white text-black p-3"
              onChange={(e) => setSelectedYear(e.target.value)}
              value={selectedYear}
            >
              <option value="">Select Model Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Link
              href={
                isNextEnabled ? `/result/${selectedMake}/${selectedYear}` : '#'
              }
            >
              <button className='bg-white text-black' disabled={!isNextEnabled}>Next</button>
            </Link>
          </form>
        </div>
      </main>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Model {
  Model_Name: string;
  Model_ID: number;
  Make_Name: string;
  Make_ID: number;
}

const ResultPage = () => {
  const { makeId, year } = useParams();
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (makeId && year) {
      const fetchModels = async () => {
        try {
          const response = await fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
          );
          const data = await response.json();
          setModels(data.Results || []);
        } catch (err) {
          setError('Failed to fetch vehicle models');
        }
      };

      fetchModels();
    }
  }, [makeId, year]);

  if (!makeId || !year) {
    return <div>Loading...</div>;
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Vehicle Models for {year}</h1>
      {models.length > 0 ? (
        <ul className="list-disc pl-5">
          {models.map((model) => (
            <li key={`${model.Make_ID}-${model.Model_ID}`}>
              {model.Model_Name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No models found for the selected make and year.</p>
      )}
    </div>
  );
};

export default ResultPage;

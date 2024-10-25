"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { GetStaticPaths } from 'next';

interface Model {
  modelName: string;
  modelId: number;
  makeName: string;
  makeId: number;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(
    'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
  );
  const data = await response.json();
  const makes = data.Makes;
  const years = Array.from({ length: 10 }, (_, i) => 2015 + i);

  const paths = makes.flatMap((make:any) =>
    years.map((year) => ({
      params: { makeId: make.MakeId.toString(), year: year.toString() },
    }))
  );

  return {
    paths,
    fallback: 'blocking',
  };
};

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
          console.log(data.Results)
          setModels(data.Results || []);
        } catch (err) {
          setError('Failed to fetch vehicle models');
        }
      };

      fetchModels();
    }
  }, [makeId, year]);


  useEffect(() => {
    console.log(models)
  }, [models])

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
            // <li key={model.modelId}>{model.modelName}</li>
            <li key={model.modelId}>{model.makeName}</li>
          ))}
        </ul>
      ) : (
        <p>No models found for the selected make and year.</p>
      )}
    </div>
  );
};

export default ResultPage;

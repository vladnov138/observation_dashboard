import React from 'react';

type Observation = {
  id: number;
  start: string;
  waterfall: string;
};

type Props = {
  images: Observation[];
  noradId: string;
};

const WaterfallGallery: React.FC<Props> = ({ images, noradId }) => {
  return (
    <div className="p-4 shadow rounded">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Waterfall изображения для спутника с NORAD ID: {noradId}
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {images.slice(0, 6).map((obs) => (
          <div key={obs.id} className="flex flex-col items-center gap-2 w-full sm:w-72">
            <img
              src={obs.waterfall}
              alt="Waterfall"
              className="w-full h-auto rounded shadow object-contain"
            />
            <p className="text-sm text-gray-600 text-center">
              {new Date(obs.start).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterfallGallery;
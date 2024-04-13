import Spinner from "./spinner";

type Props = {
  hasError?: boolean;
  isLoading?: boolean;
};

function MapOverlay({ hasError, isLoading }: Props) {
  if (!hasError && !isLoading) return null;

  return (
    <div className="absolute z-50 top-0 left-0 bottom-0 right-0 bg-black/30">
      {isLoading && !hasError && (
        <Spinner className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      )}
      {hasError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-4 px-8 rounded bg-white">
          <p>Oops, looks like something went wrong.</p>
        </div>
      )}
    </div>
  );
}

export default MapOverlay;

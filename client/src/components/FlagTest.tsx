import { useQuery } from "@tanstack/react-query";

export default function FlagTest() {
  const { data: countries = [] } = useQuery({
    queryKey: ['/api/countries'],
  });

  return (
    <div className="p-4 border rounded-lg bg-white shadow-lg">
      <h3 className="font-bold mb-4">Flag Test Component</h3>
      <div className="space-y-2">
        {countries.slice(0, 5).map((country: any) => (
          <div key={country.id} className="flex items-center space-x-3">
            <span 
              className="text-2xl emoji" 
            >
              {country.flag || '🏳️'}
            </span>
            <span className="font-medium">{country.name}</span>
            <span className="text-sm text-gray-500">({country.code})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
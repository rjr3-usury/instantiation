// @ts-nocheck
import { supabase } from '../../lib/supabase';

export const revalidate = 60; 

export default async function Citadel() {
  const { data: municipalities, error } = await supabase
    .from('municipalities')
    .select(`
      name,
      population,
      average_monthly_water_bill,
      bonds (
        project_name,
        principal_issued,
        wall_street_usury,
        aggregate_extraction_rate,
        monthly_citizen_surcharge
      )
    `);

  if (error) {
    return <div className="p-10 text-red-500 font-mono">Database Error: {error.message}</div>;
  }

  return (
    <main className="min-h-screen bg-black text-green-500 p-4 md:p-10 font-mono selection:bg-green-900 selection:text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-widest border-b border-green-800 pb-4 uppercase">
          [ USURY.COM // CITADEL ]
        </h1>
        
        {municipalities?.map((city, idx) => (
          <div key={idx} className="mb-10 border border-green-900 p-6 bg-black shadow-[0_0_15px_rgba(0,255,0,0.05)]">
            <h2 className="text-3xl font-bold text-white mb-2 uppercase">TARGET NODE: {city.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-green-400 border-b border-green-900 pb-4 uppercase">
              <div>POPULATION: {Number(city.population).toLocaleString()}</div>
              <div>WATER BILL MATRIX: ${city.average_monthly_water_bill}/mo</div>
            </div>

            <h3 className="text-xl text-red-500 mb-4 font-bold tracking-wider uppercase">EXTRACTION VECTORS</h3>
            {city.bonds.map((bond: any, bIdx: number) => (
              <div key={bIdx} className="bg-black p-5 border border-red-900 relative overflow-hidden mt-4">
                <div className="absolute top-0 right-0 bg-red-900 text-white text-xs px-2 py-1 font-bold uppercase">
                  ACTIVE LEAK
                </div>
                <div className="text-xl text-white mb-4 border-b border-gray-800 pb-2 uppercase">{bond.project_name}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-400 uppercase">PRINCIPAL ISSUED: <br/><span className="text-lg text-white">${Number(bond.principal_issued).toLocaleString()}</span></div>
                  <div className="text-red-500 uppercase">WALL STREET USURY: <br/><span className="text-lg font-bold">${Number(bond.wall_street_usury).toLocaleString()}</span></div>
                  <div className="text-red-600 font-bold bg-red-900/20 p-3 border border-red-900/50 uppercase mt-2">
                    AGGREGATE EXTRACTION RATE: <br/><span className="text-3xl">{bond.aggregate_extraction_rate}%</span>
                  </div>
                  <div className="text-yellow-500 font-bold bg-yellow-900/20 p-3 border border-yellow-900/50 uppercase mt-2">
                    CITIZEN SURCHARGE: <br/><span className="text-3xl">${bond.monthly_citizen_surcharge}/mo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
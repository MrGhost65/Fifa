const BASE_URL = 'https://api.fifa.com/api/v3';

async function obtenerPartidosMexico() {
  try {
    const url = `${BASE_URL}/calendar/matches?idCompetition=17&idSeason=285023&idGroup=289275&language=es`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const data = await response.json();
    
    // Filtrar solo los encuentros de México
    const partidosMexico = data.Results.filter(
      match => match.Home?.IdCountry === 'MEX' || match.Away?.IdCountry === 'MEX'
    );

    // Obtener detalles y eventos de cada partido
    for (const match of partidosMexico) {
      const statsRes = await fetch(`${BASE_URL}/timelines/${match.IdMatch}?language=es`);
      const statsData = statsRes.ok ? await statsRes.json() : { Event: [] };
      
      const goles = statsData.Event.filter(e => e.Type === 0);
      const amarillas = statsData.Event.filter(e => e.Type === 2);
      
      console.log(`Partido: ${match.Home.ShortClubName} vs ${match.Away.ShortClubName}`);
      console.log(`Marcador: ${match.Home.Score ?? 0} - ${match.Away.Score ?? 0}`);
      console.log(`Goles: ${goles.length} | Tarjetas Amarillas: ${amarillas.length}`);
    }
  } catch (error) {
    console.error('Error al consultar la API de FIFA:', error.message);
  }
}
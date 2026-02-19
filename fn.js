async function fx() {
  const res = await fetch("https://solid-geolocation.vercel.app/location");
  const data = await res.json();
  const { ip, city, country } = data;

  return { ip, city, country };
}

const { city } = await fx();

console.log(city.postalCode);

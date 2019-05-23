var cities = [
    "Aberdeen",
    "Abilene",
    "Aguada",
    "Aguas",
    "Aibonito",
    "Akron",
    "Albany",
    "Albuquerque",
    "Alexandria",
    "Allentown",
    "Alta",
    "Alto",
    "Amarillo",
    "Anaheim",
    "Anchorage",
    "Ann Arbor",
    "Antioch",
    "Apple Valley",
    "Appleton",
    "Arlington",
    "Arroyo",
    "Arvada",
    "Asheville",
    "Athens",
    "Atlanta",
    "Atlantic City",
    "Augusta",
    "Aurora",
    "Austin",
    "Baja",
    "Bakersfield",
    "Baltimore",
    "Barceloneta",
    "Barnstable",
    "Baton Rouge",
    "Bayamón",
    "Beaumont",
    "Bel Air",
    "Bellevue",
    "Berkeley",
    "Bethlehem",
    "Billings",
    "Birmingham",
    "Bloomington",
    "Boise",
    "Boise City",
    "Bonita Springs",
    "Boston",
    "Boulder",
    "Bradenton",
    "Bremerton",
    "Bridgeport",
    "Brighton",
    "Brownsville",
    "Bryan",
    "Buffalo",
    "Burbank",
    "Burlington",
    "Cambridge",
    "Camuy",
    "Canton",
    "Cape Coral",
    "Carolina",
    "Carrollton",
    "Cary",
    "Cathedral City",
    "Cayey",
    "Cedar Rapids",
    "Champaign",
    "Chandler",
    "Charleston",
    "Charlotte",
    "Chattanooga",
    "Chesapeake",
    "Chicago",
    "Chula Vista",
    "Ciales",
    "Cincinnati",
    "Clarke County",
    "Clarksville",
    "Clearwater",
    "Cleveland",
    "Coamo",
    "College Station",
    "Colorado Springs",
    "Columbia",
    "Columbus",
    "Concord",
    "Coral Springs",
    "Corona",
    "Corozal",
    "Corpus Christi",
    "Costa Mesa",
    "Dallas",
    "Daly City",
    "Danbury",
    "Davenport",
    "Davidson County",
    "Dayton",
    "Daytona Beach",
    "Deltona",
    "Denton",
    "Denver",
    "Des Moines",
    "Detroit",
    "Dorado",
    "Downey",
    "Duluth",
    "Durham",
    "Díaz",
    "El Monte",
    "El Paso",
    "Elizabeth",
    "Elk Grove",
    "Elkhart",
    "Erie",
    "Escondido",
    "Eugene",
    "Evansville",
    "Fairfield",
    "Fargo",
    "Fayetteville",
    "Fitchburg",
    "Flint",
    "Florida",
    "Fontana",
    "Fort Collins",
    "Fort Lauderdale",
    "Fort Smith",
    "Fort Walton Beach",
    "Fort Wayne",
    "Fort Worth",
    "Frederick",
    "Fremont",
    "Fresno",
    "Fullerton",
    "Gainesville",
    "Garden Grove",
    "Garland",
    "Gastonia",
    "Germán",
    "Gilbert",
    "Glendale",
    "Grand Prairie",
    "Grand Rapids",
    "Grayslake",
    "Green Bay",
    "GreenBay",
    "Greensboro",
    "Greenville",
    "Guayanilla",
    "Gulfport-Biloxi",
    "Gurabo",
    "Hagerstown",
    "Hampton",
    "Harlingen",
    "Harrisburg",
    "Hartford",
    "Hatillo",
    "Havre de Grace",
    "Hayward",
    "Hemet",
    "Henderson",
    "Hesperia",
    "Hialeah",
    "Hickory",
    "High Point",
    "Hollywood",
    "Honolulu",
    "Houma",
    "Houston",
    "Howell",
    "Humacao",
    "Huntington",
    "Huntington Beach",
    "Huntsville",
    "Independence",
    "Indianapolis",
    "Inglewood",
    "Irvine",
    "Irving",
    "Isabel",
    "Jackson",
    "Jacksonville",
    "Jayuya",
    "Jefferson",
    "Jersey City",
    "Johnson City",
    "Joliet",
    "Juan",
    "Kailua",
    "Kalamazoo",
    "Kaneohe",
    "Kansas City",
    "Kennewick",
    "Kenosha",
    "Killeen",
    "Kissimmee",
    "Knoxville",
    "Lacey",
    "Lafayette",
    "Lajas",
    "Lake Charles",
    "Lakeland",
    "Lakewood",
    "Lancaster",
    "Lansing",
    "Laredo",
    "Las",
    "Las",
    "Las Cruces",
    "Las Vegas",
    "Layton",
    "Leominster",
    "Lewisville",
    "Lexington",
    "Lincoln",
    "Little Rock",
    "Loiza",
    "Long Beach",
    "Lorain",
    "Lorenzo",
    "Los Angeles",
    "Louisville",
    "Lowell",
    "Lubbock",
    "Macon",
    "Madison",
    "Manatí",
    "Manchester",
    "Marina",
    "Marysville",
    "Maunabo",
    "McAllen",
    "McHenry",
    "Medford",
    "Melbourne",
    "Memphis",
    "Merced",
    "Mesa",
    "Mesquite",
    "Miami",
    "Milwaukee",
    "Minneapolis",
    "Miramar",
    "Mission Viejo",
    "Mobile",
    "Moca",
    "Modesto",
    "Monroe",
    "Monterey",
    "Montgomery",
    "Moreno Valley",
    "Murfreesboro",
    "Murrieta",
    "Muskegon",
    "Myrtle Beach",
    "Naguabo",
    "Naperville",
    "Naples",
    "Nashua",
    "Nashville",
    "New Bedford",
    "New Haven",
    "New London",
    "New Orleans",
    "New York",
    "New York City",
    "Newark",
    "Newburgh",
    "Newport News",
    "Norfolk",
    "Normal",
    "Norman",
    "North Charleston",
    "North Las Vegas",
    "North Port",
    "Norwalk",
    "Norwich",
    "Oakland",
    "Ocala",
    "Oceanside",
    "Odessa",
    "Ogden",
    "Oklahoma City",
    "Olathe",
    "Olympia",
    "Omaha",
    "Ontario",
    "Orange",
    "Orem",
    "Orlando",
    "Orocovis",
    "Overland Park",
    "Oxnard",
    "Palm Bay",
    "Palm Springs",
    "Palmdale",
    "Panama City",
    "Pasadena",
    "Paterson",
    "Pembroke Pines",
    "Pensacola",
    "Peoria",
    "Peñuelas",
    "Philadelphia",
    "Phoenix",
    "Pittsburgh",
    "Plano",
    "Pomona",
    "Pompano Beach",
    "Port Arthur",
    "Port Orange",
    "Port Saint Lucie",
    "Port St. Lucie",
    "Portland",
    "Portsmouth",
    "Poughkeepsie",
    "Providence",
    "Provo",
    "Pueblo",
    "Punta Gorda",
    "Quebradillas",
    "Racine",
    "Raleigh",
    "Rancho Cucamonga",
    "Reading",
    "Redding",
    "Reno",
    "Richland",
    "Richmond",
    "Richmond County",
    "Rio",
    "Riverside",
    "Roanoke",
    "Rochester",
    "Rockford",
    "Rojo",
    "Roseville",
    "Round Lake Beach",
    "Sabana",
    "Sacramento",
    "Saginaw",
    "Saint Louis",
    "Saint Paul",
    "Saint Petersburg",
    "Salem",
    "Salinas",
    "Salinas",
    "Salt Lake City",
    "San Antonio",
    "San Bernardino",
    "San Buenaventura",
    "San Diego",
    "San Francisco",
    "San Jose",
    "Santa Ana",
    "Santa Barbara",
    "Santa Clara",
    "Santa Clarita",
    "Santa Cruz",
    "Santa Maria",
    "Santa Rosa",
    "Sarasota",
    "Savannah",
    "Scottsdale",
    "Scranton",
    "Seaside",
    "Seattle",
    "Sebastian",
    "Sebastián",
    "Shreveport",
    "Simi Valley",
    "Sioux City",
    "Sioux Falls",
    "South Bend",
    "South Lyon",
    "Spartanburg",
    "Spokane",
    "Springdale",
    "Springfield",
    "St. Louis",
    "St. Paul",
    "St. Petersburg",
    "Stamford",
    "Sterling Heights",
    "Stockton",
    "Sunnyvale",
    "Syracuse",
    "Tacoma",
    "Tallahassee",
    "Tampa",
    "Temecula",
    "Tempe",
    "Thornton",
    "Thousand Oaks",
    "Toledo",
    "Topeka",
    "Torrance",
    "Trenton",
    "Tucson",
    "Tulsa",
    "Tuscaloosa",
    "Tyler",
    "Utica",
    "Vallejo",
    "Vancouver",
    "Vega",
    "Vega",
    "Vero Beach",
    "Victorville",
    "Vieques",
    "Virginia Beach",
    "Visalia",
    "Waco",
    "Warren",
    "Washington",
    "Waterbury",
    "Waterloo",
    "West Covina",
    "West Valley City",
    "Westminster",
    "Wichita",
    "Wilmington",
    "Winston",
    "Winter Haven",
    "Worcester",
    "Yabucoa",
    "Yakima",
    "Yauco",
    "Yonkers",
    "York",
    "Youngstown"]

export default cities
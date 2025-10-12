// Get event type and subtype translations
export const eventTypeMap = {
  party: { icon: "🎉", en: "Party", es: "Fiesta" },
  art: { icon: "🎨", en: "Art", es: "Arte" },
  food: { icon: "🍴", en: "Food", es: "Gastronomía" },
  sport: { icon: "🏅", en: "Sport", es: "Deporte" },
  educational: { icon: "📚", en: "Educational", es: "Educacional" },
  familiar: { icon: "👨‍👩‍👧‍👦", en: "Familiar", es: "Familiar" },
  excursion: { icon: "🚌", en: "Excursion", es: "Excurción" },
  work: { icon: "💼", en: "Work", es: "Trabajo" },
};

export const eventSubTypeMap = {
  // Party subtypes
  nightClub: { icon: "🪩", en: "Night Club", es: "Club Nocturno" },
  childrensParty: { icon: "🤡", en: "Children's Party", es: "Actividad Infantil" },
  // Art subtypes
  comedyShow: { icon: "😂", en: "Comedy Show", es: "Show de Comedia" },
  theater: { icon: "🎭", en: "Theater", es: "Teatro" },
  cinema: { icon: "🎞️", en: "Cinema", es: "Cine" },
  dance: { icon: "🩰", en: "Dance", es: "Danza" },
  literature: { icon: "📚", en: "Literature", es: "Literatura" },
  gallery: { icon: "🖼️", en: "Gallery", es: "Galería" },
  fashion: { icon: "🥻", en: "Fashion", es: "Moda" },
  concert: { icon: "🎤", en: "Concert", es: "Concierto" },
  // Food subtypes
  food: { icon: "🍽️", en: "Food", es: "Comida" },
  spiritsTasting: { icon: "🍷", en: "Spirits Tasting", es: "Cata" },
  // Sport subtypes
  marathon: { icon: "🏃🏻", en: "Marathon", es: "Maratón" },
  fitness: { icon: "💪🏻", en: "Fitness", es: "Fitness" },
  skating: { icon: "🛼", en: "Skating", es: "Patinaje" },
  boxing: { icon: "🥊", en: "Boxing", es: "Boxeo" },
  // Educational subtypes
  conference: { icon: "🎓", en: "Conference", es: "Conferencia" },
  workshop: { icon: "🧶", en: "Workshop", es: "Taller" },
  networking: { icon: "🕸️", en: "Networking", es: "Networking" },
  // Familiar subtypes
  bachelorParty: { icon: "🤵🏻", en: "Bachelor Party", es: "Despedida de Soltero" },
  wedding: { icon: "👰🏻", en: "Wedding", es: "Boda" },
  birthday: { icon: "🎂", en: "Birthday", es: "Cumpleaños" },
  babyShower: { icon: "🤰🏻", en: "Baby Shower", es: "Baby Shower" },
  genderReveal: { icon: "♂️♀️", en: "Gender Reveal", es: "Revelación de Género" },
  // Excursion subtypes
  cityTour: { icon: "🏙️", en: "City Tour", es: "Tour por la Ciudad" },
  natureExcursion: { icon: "🏞️", en: "Nature Excursion", es: "Excursión por la Naturaleza" },
  camping: { icon: "🏕️", en: "Camping", es: "Camping" },
  beach: { icon: "🏖️", en: "Beach", es: "Playa" },
  // Work subtypes
  forum: { icon: "💬", en: "Forum", es: "Foro" },
  expo: { icon: "🏢", en: "Expo", es: "Exposición" },
};

export const getEventType = (type: string, locale: string) => {
  const typeData = eventTypeMap[type as keyof typeof eventTypeMap];

  if (!typeData) {
    return {
      label: type,
      icon: "",
    };
  }

  return {
    label: typeData[locale as "es" | "en"] ?? type,
    icon: typeData.icon ?? "",
  };
};

export const getEventSubType = (type: string, locale: string) => {
  const subTypeData = eventSubTypeMap[type as keyof typeof eventSubTypeMap];

  if (!subTypeData) {
    return {
      label: type,
      icon: "",
    };
  }

  return {
    label: subTypeData[locale as "es" | "en"] ?? type,
    icon: subTypeData.icon ?? "",
  };
};

export type EventType = keyof typeof eventTypeMap;
export type EventSubType = keyof typeof eventSubTypeMap;

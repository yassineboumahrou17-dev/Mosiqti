// ─── Types ───────────────────────────────────────────────────────────────────

export type RecipientType =
  | "husband"
  | "wife"
  | "children"
  | "father"
  | "mother"
  | "sibling"
  | "friend"
  | "myself"
  | "other";

export type GenreType =
  | "chaabi"
  | "rai"
  | "rap-marocain"
  | "pop-marocaine"
  | "gnawa"
  | "amazigh"
  | "classique-oriental"
  | "autre";

export type VoiceGender = "female" | "male" | "no-preference";

export type SongLanguage =
  | "darija"
  | "french"
  | "english"
  | "spanish"
  | "german"
  | "italian"
  | "portuguese"
  | "tamazight"
  | "tarifit"
  | "tachelhit"
  | "hassaniya"
  | "arabe-classique";

export type OfferType = "standard" | "express";

export type QuizFieldType =
  | "radio"
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "select";

// ─── Structures ──────────────────────────────────────────────────────────────

export interface QuizOption {
  value: string;
  label: string;
}

export interface QuizAnswers {
  recipientType: RecipientType | null;
  recipientName: string;
  genre: GenreType | null;
  customGenre?: string;
  voiceGender: VoiceGender | null;
  beautifulQualities: string;
  specialMoments: string;
  specialMessage: string;
  songLanguage: SongLanguage;
  selectedOffer: OfferType | null;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
}

export interface QuizField {
  id: string;
  field: keyof QuizAnswers;
  label: string;
  type: QuizFieldType;
  options?: QuizOption[];
  placeholder?: string;
  hint?: string;
  required: boolean;
  condition?: (answers: QuizAnswers) => boolean;
}

export interface QuizPage {
  id: string;
  order: number;
  title: string;
  subtitle?: string;
  fields: QuizField[];
}

// ─── Valeurs initiales ───────────────────────────────────────────────────────

export const INITIAL_QUIZ_ANSWERS: QuizAnswers = {
  recipientType: null,
  recipientName: "",
  genre: null,
  customGenre: "",
  voiceGender: null,
  beautifulQualities: "",
  specialMoments: "",
  specialMessage: "",
  songLanguage: "french",
  selectedOffer: null,
  email: "",
  phoneCountryCode: "+33",
  phoneNumber: "",
};

// ─── Options Dynamiques ────────────────────────────────────

export const getRecipientOptions = (t: any): QuizOption[] => [
  { value: "husband", label: t('options.recipient.husband') },
  { value: "wife", label: t('options.recipient.wife') },
  { value: "children", label: t('options.recipient.children') },
  { value: "father", label: t('options.recipient.father') },
  { value: "mother", label: t('options.recipient.mother') },
  { value: "sibling", label: t('options.recipient.sibling') },
  { value: "friend", label: t('options.recipient.friend') },
  { value: "myself", label: t('options.recipient.myself') },
  { value: "other", label: t('options.recipient.other') },
];

export const getGenreOptions = (t: any): QuizOption[] => [
  { value: "chaabi", label: t('options.genre.chaabi') },
  { value: "rai", label: t('options.genre.rai') },
  { value: "rap-marocain", label: t('options.genre.rap') },
  { value: "pop-marocaine", label: t('options.genre.pop') },
  { value: "gnawa", label: t('options.genre.gnawa') },
  { value: "amazigh", label: t('options.genre.amazigh') },
  { value: "classique-oriental", label: t('options.genre.tarab') },
  { value: "autre", label: t('options.genre.other') },
];

export const getVoiceOptions = (t: any): QuizOption[] => [
  { value: "female", label: t('options.voice.female') },
  { value: "male", label: t('options.voice.male') },
  { value: "no-preference", label: t('options.voice.noPreference') },
];

export const getLanguageOptions = (t: any): QuizOption[] => [
  { value: "darija", label: t('options.language.darija') },
  { value: "tamazight", label: t('options.language.tamazight') },
  { value: "tarifit", label: t('options.language.tarifit') },
  { value: "tachelhit", label: t('options.language.tachelhit') },
  { value: "hassaniya", label: t('options.language.hassaniya') },
  { value: "arabe-classique", label: t('options.language.arabeClassique') },
  { value: "french", label: t('options.language.french') },
  { value: "english", label: t('options.language.english') },
  { value: "spanish", label: t('options.language.spanish') },
];

export const PHONE_COUNTRY_OPTIONS: QuizOption[] = [
  { value: "+33", label: "+33 (France)" },
  { value: "+212", label: "+212 (Maroc)" },
  { value: "+32", label: "+32 (Belgique)" },
  { value: "+41", label: "+41 (Suisse)" },
  { value: "+1", label: "+1 (USA)" },
  { value: "+44", label: "+44 (Royaume-Uni)" },
  { value: "+34", label: "+34 (Espagne)" },
];

export const getOfferOptions = (t: any): QuizOption[] => [
  { value: "standard", label: t('options.offer.standard') },
  { value: "express", label: t('options.offer.express') },
];

// ─── Pages du quiz Dynamiques ───────────────────────────────

export const getQuizPages = (t: any): QuizPage[] => [
  {
    id: "basics",
    order: 1,
    title: t('pages.basics.title'),
    subtitle: t('pages.basics.subtitle'),
    fields: [
      {
        id: "recipient",
        field: "recipientType",
        label: t('pages.basics.fields.recipient.label'),
        type: "radio",
        options: getRecipientOptions(t),
        required: true,
      },
      {
        id: "name",
        field: "recipientName",
        label: t('pages.basics.fields.name.label'),
        type: "text",
        placeholder: t('pages.basics.fields.name.placeholder'),
        hint: t('pages.basics.fields.name.hint'),
        required: true,
      },
    ],
  },
  {
    id: "genre",
    order: 2,
    title: t('pages.genre.title'),
    fields: [
      {
        id: "preferred-genre",
        field: "genre",
        label: t('pages.genre.fields.preferredGenre.label'),
        type: "radio",
        options: getGenreOptions(t),
        required: true,
      },
      {
        id: "custom-genre",
        field: "customGenre",
        label: t('pages.genre.fields.customGenre.label'),
        type: "text",
        placeholder: t('pages.genre.fields.customGenre.placeholder'),
        required: true,
        condition: (answers: QuizAnswers) => answers.genre === "autre",
      },
      {
        id: "voice-gender",
        field: "voiceGender",
        label: t('pages.genre.fields.voiceGender.label'),
        type: "radio",
        options: getVoiceOptions(t),
        hint: t('pages.genre.fields.voiceGender.hint'),
        required: true,
      },
    ],
  },
  {
    id: "qualities",
    order: 3,
    title: t('pages.qualities.title'),
    subtitle: t('pages.qualities.subtitle'),
    fields: [
      {
        id: "beautiful-qualities",
        field: "beautifulQualities",
        label: t('pages.qualities.fields.beautifulQualities.label'),
        type: "textarea",
        placeholder: t('pages.qualities.fields.beautifulQualities.placeholder'),
        required: true,
      },
    ],
  },
  {
    id: "memories",
    order: 4,
    title: t('pages.memories.title'),
    subtitle: t('pages.memories.subtitle'),
    fields: [
      {
        id: "special-moments",
        field: "specialMoments",
        label: t('pages.memories.fields.specialMoments.label'),
        type: "textarea",
        placeholder: t('pages.memories.fields.specialMoments.placeholder'),
        required: true,
      },
    ],
  },
  {
    id: "message",
    order: 5,
    title: t('pages.message.title'),
    subtitle: t('pages.message.subtitle'),
    fields: [
      {
        id: "special-message",
        field: "specialMessage",
        label: t('pages.message.fields.specialMessage.label'),
        type: "textarea",
        placeholder: t('pages.message.fields.specialMessage.placeholder'),
        required: true,
      },
    ],
  },
  {
    id: "checkout",
    order: 6,
    title: t('pages.checkout.title'),
    subtitle: "", // dynamique dans le wizard avec le prénom
    fields: [
      {
        id: "selected-offer",
        field: "selectedOffer",
        label: t('pages.checkout.fields.selectedOffer.label'),
        type: "radio",
        options: getOfferOptions(t),
        required: true,
      },
      {
        id: "song-language",
        field: "songLanguage",
        label: t('pages.checkout.fields.songLanguage.label'),
        type: "select",
        options: getLanguageOptions(t),
        required: true,
      },
      {
        id: "email",
        field: "email",
        label: t('pages.checkout.fields.email.label'),
        type: "email",
        placeholder: t('pages.checkout.fields.email.placeholder'),
        required: true,
      },
      {
        id: "phone",
        field: "phoneNumber",
        label: t('pages.checkout.fields.phone.label'),
        type: "tel",
        placeholder: t('pages.checkout.fields.phone.placeholder'),
        required: true,
      },
    ],
  },
];

// ─── Tarification ────────────────────────────────────────────────────────────

export const PRICE_STANDARD = 190;
export const PRICE_EXPRESS = 290;

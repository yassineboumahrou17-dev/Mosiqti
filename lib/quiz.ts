import {
  INITIAL_QUIZ_ANSWERS,
  getRecipientOptions,
  getGenreOptions,
  getVoiceOptions,
  getLanguageOptions,
  getOfferOptions,
  type QuizAnswers,
  type QuizField,
  type QuizPage,
} from "@/data/quizData";

export function getOptionLabel(
  field: keyof QuizAnswers,
  value: string | null,
  t: any,
  answers?: QuizAnswers,
): string {
  if (!value) return "—";
  if (field === "genre" && value === "autre" && answers?.customGenre) {
    return `${t('options.genre.other')} (${answers.customGenre})`;
  }

  let options: any[] = [];
  if (field === 'recipientType') options = getRecipientOptions(t);
  else if (field === 'genre') options = getGenreOptions(t);
  else if (field === 'voiceGender') options = getVoiceOptions(t);
  else if (field === 'songLanguage') options = getLanguageOptions(t);
  else if (field === 'selectedOffer') options = getOfferOptions(t);

  return options?.find((o) => o.value === value)?.label ?? value;
}

export function getPageSubtitle(page: QuizPage, answers: QuizAnswers, t: any): string {
  if (page.id === "checkout" && answers.recipientName) {
    return t('pages.checkout.subtitle', { name: answers.recipientName });
  }
  return page.subtitle ?? "";
}

function isFieldValid(field: QuizField, answers: QuizAnswers): boolean {
  if (field.condition && !field.condition(answers)) return true;
  if (!field.required) return true;

  const value = answers[field.field];

  if (field.type === "radio" || field.type === "select") {
    return value !== null && value !== "";
  }

  if (
    field.type === "text" ||
    field.type === "textarea" ||
    field.type === "email" ||
    field.type === "tel"
  ) {
    if (field.type === "email") {
      return (
        typeof value === "string" &&
        value.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      );
    }
    return typeof value === "string" && value.trim().length > 0;
  }

  return true;
}

export function isPageValid(page: QuizPage, answers: QuizAnswers): boolean {
  return page.fields.every((field) => isFieldValid(field, answers));
}

export function getFirstInvalidField(page: QuizPage, answers: QuizAnswers): QuizField | undefined {
  return page.fields.find((field) => !isFieldValid(field, answers));
}

export function getProgressPercent(currentIndex: number, total: number): number {
  return Math.round((currentIndex / total) * 100);
}

export { INITIAL_QUIZ_ANSWERS };

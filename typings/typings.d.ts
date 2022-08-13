// declare global {
interface Window {
  useragent: () => void;
  refreshToken: (v: string) => void;
}
// }

type TRequestParams = Record<string, unknown>
type TObjetString = Record<string, string>
type TObjetStringNumber = Record<string, string | number>
type TObjectUnknown = Record<string, unknown>
type TObjectAny = Record<string, any>;
type TRules = { desc: string; valid: boolean }[];
type TEthersError = Error & { code?: string | number, data?: { code?: number, message: string } }
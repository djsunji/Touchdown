export const REPORT_REASONS = ["Veraltet", "Falsch", "Unpassend", "Spam", "Sonstiges"] as const;
export const REPORT_TYPES = ["entry", "comment", "chat", "photo"] as const;
export type ReportType = (typeof REPORT_TYPES)[number];
export const REPORT_TYPE_LABEL: Record<ReportType, string> = { entry: "Tipp", comment: "Kommentar", chat: "Chat-Nachricht", photo: "Foto" };

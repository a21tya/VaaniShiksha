interface LanguageSelectorProps {
  sourceLang?: string;
  targetLang?: string;
  onChangeSource?: (val: string) => void;
  onChangeTarget?: (val: string) => void;
  isEditable?: boolean;
}

export default function LanguageSelector({
  sourceLang = "Hindi",
  targetLang = "Santhali",
  onChangeSource,
  onChangeTarget,
  isEditable = false,
}: LanguageSelectorProps) {
  const supportedSourceLangs = ["Hindi"];
  const supportedTargetLangs = ["Santhali", "Gondi (Upcoming)", "Kurukh (Upcoming)"];

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 md:p-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-xs">
            🗣️
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900">
              Mother-Tongue Language Pair
            </h4>
            <p className="text-xs text-amber-700">
              Transforming curriculum into children&apos;s home language
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-center bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-amber-200 shadow-2xs">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Source Language
            </span>
            {isEditable && onChangeSource ? (
              <select
                value={sourceLang}
                onChange={(e) => onChangeSource(e.target.value)}
                className="text-sm font-bold text-slate-900 bg-transparent focus:outline-hidden"
              >
                {supportedSourceLangs.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm font-bold text-slate-900">{sourceLang}</span>
            )}
          </div>

          <div className="px-2 py-1 bg-amber-100 rounded-lg text-amber-800 font-bold text-sm">
            ➔
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Target Vernacular
            </span>
            {isEditable && onChangeTarget ? (
              <select
                value={targetLang}
                onChange={(e) => onChangeTarget(e.target.value)}
                className="text-sm font-bold text-amber-900 bg-transparent focus:outline-hidden"
              >
                {supportedTargetLangs.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm font-bold text-amber-900">{targetLang}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

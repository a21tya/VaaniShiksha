// Three equal bands, 3:2 proportions, and a navy-blue, 24-spoke Chakra.
// Fixed SVG fills keep the national colours independent of the app theme.
export function IndianFlag() {
  return (
    <svg className="indian-flag" viewBox="0 0 300 200" width="60" height="40" role="img" aria-label="National flag of India">
      <path fill="#FF9933" d="M0 0h300v66.666667H0z" />
      <path fill="#FFFFFF" d="M0 66.666667h300v66.666666H0z" />
      <path fill="#138808" d="M0 133.333333h300V200H0z" />
      <g fill="#000080">
        <circle cx="150" cy="100" r="28" fill="none" stroke="#000080" strokeWidth="1.5" />
        <circle cx="150" cy="100" r="4" />
        {Array.from({ length: 24 }, (_, index) => (
          <g key={index} transform={`rotate(${index * 15} 150 100)`}>
            <path d="M150 96L149 91L150 72L151 91Z" />
            <circle cx="150" cy="72.75" r="1" transform="rotate(7.5 150 100)" />
          </g>
        ))}
      </g>
    </svg>
  );
}
export function IndiaMap({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 280 320" aria-hidden="true"><path fill="currentColor" d="m77 12 15-6 8 9 17-2 9 9 16-4 12 13-7 13 8 9-4 13 14 13 17 3 8 12 24 7 9-6 12 5 4-15 17-1 8-12 16 2-1 13-12 8-1 18-10 7-8-10-15 5-4 16-10 4-9-10-12 3-3 17-12 12-4 20-19 17-11 21-14 16-9 32-13 28-6 24-13 20-8-4-7-21-11-19-10-24-7-24-9-24-2-21-10-12-10 3-13-10-7-14-11 4-10-12 2-12 21 3 9-8-5-14 7-8 11-2 7-19 9-10-5-10 8-11-5-10 5-12-5-8Z"/><path d="m211 269 3 5-2 8-3-5m5 12 3 5-1 9-3-5m-158-21 2 3-1 4" stroke="currentColor" fill="none" strokeWidth="3"/></svg>;
}
export function VillageLines() {
  return <svg viewBox="0 0 400 130" className="village-lines" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M0 122h400M12 118V66m0 15C-15 56 0 30 24 33c-7-27 31-31 38-11 31-9 49 29 24 44-7 18-34 27-51 10l-23 5Zm0 14 23-36M85 121V82l47-31 50 32v39M76 83l56-41 61 41H76Zm26 37V92h20v29m17-15V90h25v16h-25Zm66 15V92l33-29 39 29v29m-82-29 43-37 49 37h-92Zm46 29v-22h15v22m53 0V78m-6-14c-29-11-20-47 7-41 8-25 42-12 37 7 31-2 40 36 14 44-21 12-38 7-46-2Zm6 25 20-38m-19 25-18-19M319 121V93l28-27 37 27v28m-72-28 35-36 45 36h-80ZM0 125c47-11 90 4 125-1s74-8 120 1 102-7 155-1"/></svg>;
}
export function BookLines() {
  return <svg viewBox="0 0 210 125" className="book-lines" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="m12 39 55-20 32 18 58-9 35 71-62 11-37-18-56 13L12 39Zm55-20 26 73m6-55 31 73M12 39l-7 6 30 68 58-14 37 19 68-14-6-5M27 45l27-10m-23 18 27-10m-23 18 27-10m-23 18 27-10m-23 18 27-10m-23 18 27-10m40-36 39-6m-35 15 39-6m-35 15 39-6m-35 15 39-6m-35 15 39-6"/></svg>;
}

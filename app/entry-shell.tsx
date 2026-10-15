import type {ReactNode} from "react";
export default function EntryShell({children}:{children:ReactNode}){
 return <main className="entry-page"><div className="entry-layout"><a className="entry-logo" href="/" aria-label="NextStep home"><img src="/oiss/tulane-oiss-logo-hd.png" alt="Tulane University Office of International Students and Scholars" width={1405} height={481}/></a><section className="entry-card">{children}</section></div></main>;
}

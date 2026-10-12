import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'CreaXa | Creative talent. Intelligently matched.',template:'%s | CreaXa'},description:'Discover AI creative talent, define your campaign, and collaborate from the first brief to final delivery.',icons:{icon:'/favicon.svg'},robots:{index:true,follow:true}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}

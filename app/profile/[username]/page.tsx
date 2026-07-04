import type {Metadata} from "next";
import ProfileView from "@/components/ProfileView";
export const metadata:Metadata={title:"Member profile"};
export default async function ProfilePage({params}:{params:Promise<{username:string}>}){const{username}=await params;return <div className="page-shell"><section className="section-space"><div className="site-container max-w-5xl"><ProfileView username={username}/></div></section></div>}

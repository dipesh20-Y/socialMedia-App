
import { useRouter } from "next/navigation";

export function useAuth(){
const router = useRouter()

function checkAuth(){
    const accessToken = localStorage.getItem('accessToken')
console.log(accessToken)

if (!accessToken) {
    router.push('/login')
}
}
return {checkAuth}

}

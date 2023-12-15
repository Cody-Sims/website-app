import { useRouter } from "next/router";

export default function Jobs() {
    const router = useRouter()
    const job = router.query.id
    return <h1>{job}</h1>
}